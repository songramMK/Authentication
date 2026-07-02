require("dotenv").config();
const nodemailer = require("nodemailer");
/**
 * Transporter কী কাজ করে?
 *
 * Nodemailer এ "Transporter" হলো এমন একটি object যা SMTP server এর সাথে
 * communicate করে email পাঠানোর কাজ করে।
 *
 * Google এর Gmail service এর জন্য একটি SMTP server আছে, যার মাধ্যমে
 * programmatically email send করা যায়।
 *
 * Transporter OAuth2 credentials ব্যবহার করে SMTP server এর সাথে secure
 * connection তৈরি করে। এই credentials এর মধ্যে থাকে:
 *
 * - Client ID
 * - Client Secret
 * - Refresh Token
 * - User Email
 *
 * এই তথ্যগুলো ব্যবহার করে আমাদের server → Gmail SMTP server এর সাথে
 * authenticate হয়ে secure session তৈরি করে এবং তারপর email send করে।
 *
 * সহজভাবে:
 * Transporter = Email পাঠানোর জন্য server ও Gmail SMTP এর মধ্যে bridge
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});
// Connection verify করা
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Email পাঠানোর function
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


// OTP Email HTML Template
const otpEmailTemplate = (otp, email ) => {
    const subject = "Send Otp" ; 
    const text = "OTP SEnD" ; 
  const html =  `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>OTP Verification</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
              <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0"
                      style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 0 10px rgba(0,0,0,0.1);">

                      <!-- Header -->
                      <tr>
                          <td align="center"
                              style="background:#2563eb;padding:25px;color:#ffffff;font-size:28px;font-weight:bold;">
                              Email Verification
                          </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                          <td style="padding:35px;color:#333333;">

                              <h2>Hello, ${email} 👋</h2>

                              <p style="font-size:16px;line-height:1.7;">
                                  Thank you for logging in.
                                  Please use the following One-Time Password (OTP)
                                  to verify your email address.
                              </p>

                              <div style="text-align:center;margin:35px 0;">
                                  <span style="
                                      display:inline-block;
                                      background:#2563eb;
                                      color:#ffffff;
                                      padding:18px 40px;
                                      font-size:32px;
                                      letter-spacing:8px;
                                      font-weight:bold;
                                      border-radius:8px;">
                                      ${otp}
                                  </span>
                              </div>

                              <p style="font-size:15px;color:#666;">
                                  This OTP is valid for
                                  <strong>5 minutes</strong>.
                              </p>

                              <p style="font-size:15px;color:#666;">
                                  If you didn't request this verification,
                                  you can safely ignore this email.
                              </p>

                              <hr style="margin:30px 0;border:none;border-top:1px solid #eeeeee;">

                              <p style="font-size:13px;color:#999;text-align:center;">
                                  Please do not share this OTP with anyone.
                              </p>

                          </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                          <td align="center"
                              style="background:#f7f7f7;padding:18px;font-size:13px;color:#777;">
                              © 2026 Your App. All Rights Reserved.
                          </td>
                      </tr>

                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>
  `;
  sendEmail(email , subject , text , html) ; 

};



module.exports = {sendEmail ,transporter ,otpEmailTemplate};

// module.exports = ;
