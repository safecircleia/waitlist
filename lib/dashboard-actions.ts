"use server"

import { createServerClient } from "./supabase"

export async function getDashboardStats() {
  try {
    const supabase = createServerClient()

    // Get total signups
    const { count: totalSignups } = await supabase.from("waitlist").select("*", { count: "exact", head: true })

    // Get referred signups
    const { count: referredSignups } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .not("referred_by", "is", null)

    // Get top referrers
    const { data: topReferrers, error: topReferrersError } = await supabase
      .from("waitlist")
      .select("referral_code, name, email")
      .in(
        "referral_code",
        await supabase
          .from("waitlist")
          .select("referred_by")
          .not("referred_by", "is", null)
          .then(({ data }) => data?.map((item) => item.referred_by) || []),
      )

    // Get referral counts for each top referrer
    const referralCounts = await Promise.all(
      (topReferrers || []).map(async (referrer) => {
        const { count } = await supabase
          .from("waitlist")
          .select("*", { count: "exact", head: true })
          .eq("referred_by", referrer.referral_code)

        return {
          ...referrer,
          count: count || 0,
        }
      }),
    )

    // Sort by count in descending order
    const sortedReferrers = referralCounts.sort((a, b) => b.count - a.count)

    // Get recent signups with referral info
    const { data: recentSignups, error: recentSignupsError } = await supabase
      .from("waitlist")
      .select("id, name, email, created_at, referred_by")
      .order("created_at", { ascending: false })
      .limit(10)

    // Get signups per day for the last 14 days
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    const { data: timeSeriesData, error: timeSeriesError } = await supabase
      .from("waitlist")
      .select("created_at")
      .gte("created_at", twoWeeksAgo.toISOString())
      .order("created_at", { ascending: true })

    // Process time series data
    const signupsByDay: Record<string, number> = {}

    // Initialize all days in the last 14 days with 0
    for (let i = 0; i < 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      signupsByDay[dateString] = 0
    }

    // Count signups per day
    if (timeSeriesData) {
      timeSeriesData.forEach((item) => {
        const dateString = new Date(item.created_at).toISOString().split("T")[0]
        signupsByDay[dateString] = (signupsByDay[dateString] || 0) + 1
      })
    }

    // Convert to array and sort by date
    const timeSeriesArray = Object.entries(signupsByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return {
      totalSignups: totalSignups || 0,
      referredSignups: referredSignups || 0,
      conversionRate: totalSignups ? Math.round((referredSignups / totalSignups) * 100) : 0,
      topReferrers: sortedReferrers,
      recentSignups: recentSignups || [],
      timeSeriesData: timeSeriesArray,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalSignups: 0,
      referredSignups: 0,
      conversionRate: 0,
      topReferrers: [],
      recentSignups: [],
      timeSeriesData: [],
    }
  }
}
