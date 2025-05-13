"use server"

import { Resend } from "resend"
import { createServerClient } from "./supabase"

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789")
const FROM_EMAIL = "waitlist@safecircle.com"

/**
 * Sends an email notification to a referrer when someone uses their referral link
 */
export async function sendReferralNotification(referralCode: string, newSignupName: string, newSignupEmail: string) {
  try {
    // Get the referrer's information from the database
    const supabase = createServerClient()
    const { data: referrer, error } = await supabase
      .from("waitlist")
      .select("name, email")
      .eq("referral_code", referralCode)
      .single()

    if (error || !referrer) {
      console.error("Error finding referrer:", error)
      return { success: false, error: "Referrer not found" }
    }

    // Send the email notification
    const { data, error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: referrer.email,
      subject: "Someone joined SafeCircle using your referral!",
      html: getReferralEmailTemplate(referrer.name, newSignupName, newSignupEmail),
    })

    if (sendError) {
      console.error("Error sending email:", sendError)
      return { success: false, error: sendError.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in sendReferralNotification:", error)
    return { success: false, error: "Failed to send notification" }
  }
}

// Email template for referral notifications
function getReferralEmailTemplate(referrerName: string, newSignupName: string, newSignupEmail: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Someone used your SafeCircle referral!</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eee;
          }
          .content {
            padding: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #eee;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #6d28d9;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Good news, ${referrerName}!</h1>
          </div>
          <div class="content">
            <p>Someone just joined SafeCircle using your referral link!</p>
            <p><strong>${newSignupName}</strong> (${newSignupEmail}) has joined the waitlist thanks to you.</p>
            <p>Your referral has improved your position on our waitlist. The more people you refer, the higher you'll move up!</p>
            <p>Keep sharing your referral link to get even more priority access.</p>
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://safecircle.com"}" class="button">Visit SafeCircle</a>
            </div>
          </div>
          <div class="footer">
            <p>SafeCircle - Advanced Security for Everyone</p>
            <p>This email was sent to you because someone signed up using your referral link.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
