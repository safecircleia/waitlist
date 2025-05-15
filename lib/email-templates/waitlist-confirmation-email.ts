"use server"

/**
 * Email template for waitlist confirmation
 * Following SafeCircle's design language with dark theme and purple accents
 */
export async function getWaitlistConfirmationEmailTemplate(userName: string, referralCode: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SafeCircle Waitlist</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #f9f9f9;
            background-color: #080808;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 24px;
            background-color: #121212;
            border-radius: 8px;
            border: 1px solid #333;
          }
          .header {
            text-align: center;
            padding: 24px 0;
            border-bottom: 1px solid #333;
          }
          .header h1 {
            margin: 0;
            color: white;
            font-weight: 600;
          }
          .content {
            padding: 32px 0;
          }
          .content p {
            margin: 12px 0;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #333;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(to right, #8b5cf6, #6366f1);
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 24px;
            font-weight: 500;
            border: none;
          }
          .button:hover {
            background: linear-gradient(to right, #7c3aed, #4f46e5);
          }
          .logo {
            margin-bottom: 16px;
          }
          .highlight {
            color: #a78bfa;
            font-weight: 500;
          }
          .referral-code {
            background-color: rgba(139, 92, 246, 0.1);
            border: 1px solid #7c3aed;
            padding: 12px;
            border-radius: 4px;
            text-align: center;
            margin: 24px 0;
            font-family: monospace;
            font-size: 18px;
            color: #a78bfa;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="https://safecircle.tech/images/logo-nbg-medium.webp" alt="SafeCircle Logo" width="120" height="32" style="display:block;margin:0 auto;" />
            </div>
            <h1>Welcome to SafeCircle!</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>Thank you for joining the <span class="highlight">SafeCircle</span> waitlist! We're excited to have you on board as we work to make the internet safer for everyone.</p>
            
            <p>Your unique referral code is:</p>
            <div class="referral-code">${referralCode}</div>
            
            <p>Share this code with friends and family to help them get priority access to SafeCircle. The more people you refer, the higher your priority in the waitlist!</p>
            
            <div style="text-align: center;">
              <a href="https://safecircle.tech?ref=${referralCode}" class="button">Share with Friends</a>
            </div>
            
            <p>We'll keep you updated on our progress and notify you when it's your turn to access SafeCircle.</p>
          </div>
          <div class="footer">
            <p>SafeCircle - Advanced Security for Everyone</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
    </html>
  `
} 