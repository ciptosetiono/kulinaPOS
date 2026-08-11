import nodemailer from 'nodemailer';

// SMTP Transporter configuration
export const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });
};

const getSender = () => {
  const fromName = process.env.SMTP_FROM_NAME || 'KulinaPOS Enterprise';
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@kulinapos.com';
  return `"${fromName}" <${fromEmail}>`;
};

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Sends a generic HTML/text email using SMTP
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const transporter = getTransporter();
  const from = getSender();

  return await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>?/gm, ''),
  });
}

/**
 * Sends Account Verification Email via SMTP
 */
export async function sendVerificationEmail(toEmail: string, verifyUrl: string, name?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; }
        .container { max-width: 560px; margin: 0 auto; background: #1e293b; border-radius: 24px; padding: 40px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .logo { font-size: 24px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 24px; }
        .logo span { color: #d946ef; }
        h1 { font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 0; }
        p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
        .btn { display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0; }
        .footer { margin-top: 32px; text-align: center; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Kulina<span>POS</span></div>
        <h1>Confirm Your Email Address</h1>
        <p>Hello ${name || 'there'},</p>
        <p>Thank you for signing up for KulinaPOS Enterprise. Please confirm your email address to activate your organization terminal.</p>
        <a href="${verifyUrl}" class="btn">Verify Account</a>
        <p>If you didn't create an account with KulinaPOS, you can safely ignore this email.</p>
        <div class="footer">&copy; ${new Date().getFullYear()} KulinaPOS Enterprise Systems</div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: toEmail,
    subject: 'Confirm Your KulinaPOS Account',
    html,
  });
}

/**
 * Sends Password Reset Email via SMTP
 */
export async function sendPasswordResetEmail(toEmail: string, resetUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; }
        .container { max-width: 560px; margin: 0 auto; background: #1e293b; border-radius: 24px; padding: 40px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .logo { font-size: 24px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 24px; }
        .logo span { color: #c026d3; }
        h1 { font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 0; }
        p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
        .btn { display: inline-block; background-color: #c026d3; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0; }
        .footer { margin-top: 32px; text-align: center; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Kulina<span>POS</span></div>
        <h1>Reset Your Password</h1>
        <p>We received a request to reset your password for your KulinaPOS account.</p>
        <a href="${resetUrl}" class="btn">Reset Password</a>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        <div class="footer">&copy; ${new Date().getFullYear()} KulinaPOS Enterprise Systems</div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: toEmail,
    subject: 'Reset Your KulinaPOS Password',
    html,
  });
}
