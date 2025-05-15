"use strict";exports.id=423,exports.ids=[423],exports.modules={72423:(e,t,o)=>{o.d(t,{getOtpEmailTemplate:()=>i});async function i(e,t){return`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your OTP Code</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .otp-code {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 4px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 4px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your OTP Code</h1>
          </div>
          <p>Hello ${e},</p>
          <p>Your one-time password (OTP) for SafeCircle is:</p>
          <div class="otp-code">${t}</div>
          <p>This code will expire in 5 minutes. Please do not share this code with anyone.</p>
          <p>If you didn't request this OTP, please ignore this email or contact support if you have concerns.</p>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `}}};