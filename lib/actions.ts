import { createServerClient } from "./supabase"
import { z } from "zod"
import { nanoid } from "nanoid"
import { sendReferralNotification } from "./email-service"

// Define the schema for form validation
const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  company: z.string().optional(),
  referralCode: z.string().optional(),
})

export type WaitlistFormData = z.infer<typeof waitlistSchema>

export async function submitToWaitlist(formData: WaitlistFormData) {
  try {
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    return await res.json()
  } catch (error) {
    return { success: false, message: "An unexpected error occurred" }
  }
}
