import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { nanoid } from "nanoid"
import { createServerClient } from "@/lib/supabase"
import { Resend } from "resend"
import { getWaitlistConfirmationEmailTemplate } from "@/lib/email-templates/waitlist-confirmation-email"

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  company: z.string().optional(),
  referralCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = waitlistSchema.parse(body)

    const supabase = createServerClient()
    const referralCode = nanoid(8)
    const referredBy = validatedData.referralCode || null

    const { error } = await supabase
      .from("waitlist")
      .insert([
        {
          email: validatedData.email,
          name: validatedData.name,
          company: validatedData.company || null,
          referral_code: referralCode,
          referred_by: referredBy,
        },
      ])

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: false, message: "This email is already on our waitlist" }, { status: 400 })
      }
      return NextResponse.json({ success: false, message: "Failed to submit. Please try again." }, { status: 500 })
    }

    // Send confirmation email to the user
    const resend = new Resend(process.env.RESEND_API_KEY)
    const html = await getWaitlistConfirmationEmailTemplate(validatedData.name, referralCode)
    await resend.emails.send({
      from: "SafeCircle <notify@waitlist.safecircle.tech>",
      to: validatedData.email,
      subject: "Welcome to SafeCircle Waitlist!",
      html,
    })

    return NextResponse.json({ success: true, message: "Successfully joined the waitlist!", referralCode })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(", ")
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
} 