export const generateVerificationEmailHTML = (otp, verificationLink, userName) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .header {
            background: #f5f5f5;
            padding: 10px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px 0;
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 5px;
            margin: 20px 0;
            color: #4a6ee0;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4a6ee0;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Verify Your Email</h2>
          </div>
          <div class="content">
            <p>Hello ${userName || 'there'},</p>
            <p>Thank you for registering! To complete your sign-up, please verify your email address.</p>
            
            <p>Your verification code is:</p>
            <div class="otp">${otp}</div>
            
            <p>This code will expire in 15 minutes.</p>
            
            <p>Or, simply click the button below to verify instantly:</p>
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email</a>
            </div>
            
            <p>If you did not request this verification, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Subscription Tracker. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };