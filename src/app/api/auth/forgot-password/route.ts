import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configure Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log(`[Forgot Password] Attempting to send reset email to: ${email}`);

    // Generate password reset link using Supabase
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      },
    });

    if (error) {
      console.error("[Forgot Password] Supabase Error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to generate reset link" },
        { status: 400 }
      );
    }

    console.log(`[Forgot Password] Full response data:`, JSON.stringify(data, null, 2));
    console.log(`[Forgot Password] data.properties:`, data?.properties);
    
    // Get the action_link from Supabase
    const actionLink = data?.properties?.action_link;
    console.log(`[Forgot Password] Reset link generated for ${email}`);
    console.log(`[Forgot Password] Generated link:`, actionLink);
    
    if (!actionLink) {
      console.error("[Forgot Password] ERROR: No action link found in response");
      return NextResponse.json(
        { error: "Failed to generate recovery link" },
        { status: 500 }
      );
    }

    // Send email via Hostinger SMTP
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Reset Your Password - VentureNext",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #181c23;">Reset Your Password</h2>
            <p>Hi,</p>
            <p>We received a request to reset your password. Click the link below to set a new password:</p>
            <p style="margin: 30px 0;">
              <a href="${actionLink}" style="background-color: #e6b756; color: #181c23; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
              ${actionLink}
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              This link will expire in 24 hours. If you didn't request this, you can ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              © 2025 VentureNext. All rights reserved.
            </p>
          </div>
        `,
      });
      
      console.log(`[Forgot Password] Email sent successfully to ${email}`);
    } catch (emailError: any) {
      console.error(`[Forgot Password] Email sending failed:`, emailError);
      return NextResponse.json(
        { error: `Failed to send email: ${emailError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "Password reset email sent successfully"
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Forgot Password] API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
