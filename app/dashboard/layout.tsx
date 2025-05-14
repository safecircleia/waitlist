"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "@/lib/auth-client"
import { createBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { LogOut } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {  const router = useRouter()
  const { data, isPending } = useSession()
  const user = data?.user
  const isLoading = isPending
  const [activeTab, setActiveTab] = useState("waitlist")
  const [referralData, setReferralData] = useState<{
    referralCode?: string;
    hasJoinedWaitlist?: boolean;
  }>({})
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [isLoading, user, router])
    // Handle tab changes and URL updates
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    
    // Handle nested routes
    if (tab.includes('/')) {
      const [parent, child] = tab.split('/')
      router.push(`/dashboard/${parent}/${child}`)
    } else {
      router.push(`/dashboard/${tab}`)
    }
  }
  
  // Check if user has joined the waitlist
  useEffect(() => {
    if (!user) return
    
    const checkWaitlistSubmission = async () => {
      try {
        const supabase = createBrowserClient()
        // First, get the user's waitlist row
        const { data: userRow, error: userError } = await supabase
          .from("waitlist")
          .select("referral_code")
          .eq("email", user.email)
          .single()

        if (userRow && userRow.referral_code) {
          setReferralData({
            referralCode: userRow.referral_code,
            hasJoinedWaitlist: true,
          })
        } else {
          setReferralData({
            hasJoinedWaitlist: false
          })
        }
      } catch (error) {
        console.error("Error checking waitlist submission:", error)
      }
    }

    checkWaitlistSubmission()
  }, [user])
  
  // Handle sign out
  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }
  
  if (!user) return null
    return (
    <div className="min-h-screen py-10 px-4 relative">
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">SafeCircle Dashboard</h1>
            <p className="text-[#a0a0a0]">Join our revolutionary platform to protect children online.</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="bg-red-900/20 hover:bg-red-900/30 text-red-400"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <DashboardSidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            user={user}
            referralData={referralData}
          />
          
          {/* Main content */}
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-[#0f0f0f]/90 to-[#0a0a0a]/90 backdrop-blur-md rounded-xl border border-[#1a1a1a] shadow-xl overflow-hidden p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
