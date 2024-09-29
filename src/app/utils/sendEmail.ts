import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, resetLink: string) => {
  if (!config.email_user || !config.email_pass) {
    throw new Error('Email configuration is missing.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    // service: 'gmail',
    secure: config.NODE_ENV === 'production',
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  });

  const mailOptions = {
    from: config.email_user,
    to,
    subject: 'Reset Your Password within 10 min :)',
    text: `To reset your password, please click the following link: ${resetLink}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
          }
          .header img {
            max-width: 100px;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .content h1 {
            color: #0056b3;
          }
          .content p {
            line-height: 1.5;
            font-size: 16px;
          }
          .button {
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
          }
          .button:hover {
            background-color: #218838;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Email Header -->
          <div class="header">
            <img src="https://yourcompany.com/logo.png" alt="Company Logo">
            <h2>PH University</h2>
          </div>

          <!-- Email Body -->
          <div class="content">
            <h1>Password Reset Request</h1>
            <p>Dear Customer,</p>
            <p>
              You recently requested to reset your password for your account. To reset your password, please click the button below.
            </p>
            <a href={${resetLink}}>Reset Your Password . click here ${resetLink}</a>
            <p>
              If you did not request this, please ignore this email or contact our support team if you have any concerns.
            </p>
          </div>

          <!-- Company Description -->
          <div class="content">
            <p>Best regards,</p>
            <p><strong>PH University</strong></p>
            <p>Your trusted partner for all your business solutions.</p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>© 2024 PH University, All rights reserved.</p>
            <p>
              1234 Business Rd, Business City, BC 56789<br>
              <a href="https://hakim-portfolio-web.vercel.app" style="color: #0056b3;">Visit our website</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
