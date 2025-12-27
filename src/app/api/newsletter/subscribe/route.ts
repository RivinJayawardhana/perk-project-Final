import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.error("BREVO_API_KEY is not set");
      return NextResponse.json(
        { error: "Newsletter service not configured" },
        { status: 500 }
      );
    }

    // Add contact to Brevo list
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        email: email,
        listIds: [2], // Default list ID, can be customized
        attributes: {
          SIGNUP_SOURCE: "website_footer",
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API error:", errorData);

      // If contact already exists, that's fine
      if (response.status === 400 && errorData.code === "duplicate_parameter") {
        return NextResponse.json(
          { success: true, message: "Email already subscribed" },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: "Failed to subscribe to newsletter" },
        { status: response.status }
      );
    }

    // Send confirmation email to user
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Welcome to Our Newsletter",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Our Newsletter!</h2>
            <p style="color: #666; font-size: 16px;">Thank you for subscribing to our newsletter.</p>
            <p style="color: #666; font-size: 16px;">You'll now receive updates, news, and exclusive content delivered straight to your inbox.</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">Best regards,<br/>The Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Confirmation email error:", emailError);
      // Continue even if confirmation email fails
    }

    return NextResponse.json(
      { success: true, message: "Successfully subscribed to newsletter" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}
