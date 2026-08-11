import { NextResponse } from 'next/server';
import { sendEmail, sendVerificationEmail, sendPasswordResetEmail, getTransporter } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, to, subject, html, verifyUrl, resetUrl, name } = body;

    if (!to) {
      return NextResponse.json({ error: 'Recipient email "to" is required' }, { status: 400 });
    }

    let result;

    if (action === 'verify' && verifyUrl) {
      result = await sendVerificationEmail(to, verifyUrl, name);
    } else if (action === 'reset' && resetUrl) {
      result = await sendPasswordResetEmail(to, resetUrl);
    } else if (subject && html) {
      result = await sendEmail({ to, subject, html });
    } else {
      return NextResponse.json(
        { error: 'Invalid parameters. Provide (action="verify" & verifyUrl) or (action="reset" & resetUrl) or (subject & html).' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      accepted: result.accepted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send email via SMTP' },
      { status: 500 }
    );
  }
}

// GET endpoint to verify SMTP configuration connection
export async function GET() {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return NextResponse.json({
      success: true,
      status: 'SMTP Connection Verified Successfully',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'SMTP Connection Verification Failed',
      error: error.message,
    }, { status: 500 });
  }
}
