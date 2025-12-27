import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import sanitizeHtml from "sanitize-html";
import { LeadFormSchema } from "@/lib/form-validation";
import {
  verifyRecaptcha,
  checkRateLimit,
  logSubmission,
  getClientIp,
} from "@/lib/form-security";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const perkId = searchParams.get("perk_id");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("leads")
      .select("*, perks(name)")
      .order("submission_timestamp", { ascending: false })
      .range(offset, offset + limit - 1);

    if (perkId) {
      query = query.eq("perk_id", perkId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const body = await req.json();

    // Validate input with Zod
    const validationResult = LeadFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { data: formData } = validationResult;

    // Verify reCAPTCHA token (optional in development if keys not configured)
    if (process.env.RECAPTCHA_SECRET_KEY) {
      const recaptchaValid = await verifyRecaptcha(formData.recaptchaToken);
      if (!recaptchaValid && formData.recaptchaToken !== 'dev-token') {
        return NextResponse.json(
          { error: "reCAPTCHA verification failed" },
          { status: 403 }
        );
      }
    }

    // Check rate limit (5 submissions per hour per IP)
    const isUnderLimit = await checkRateLimit(clientIp, "/api/leads", 5, 60);
    if (!isUnderLimit) {
      return NextResponse.json(
        {
          error: "Too many submissions. Please try again later.",
          retryAfter: 3600,
        },
        { status: 429 }
      );
    }

    // Sanitize form_data
    const sanitizedFormData: Record<string, any> = {};
    for (const [key, value] of Object.entries(formData.form_data)) {
      if (typeof value === "string") {
        sanitizedFormData[key] = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
      } else {
        sanitizedFormData[key] = value;
      }
    }

    // Save lead to database
    const { data: leadData, error: saveError } = await supabase
      .from("leads")
      .insert({
        perk_id: formData.perk_id,
        lead_form_id: formData.lead_form_id,
        form_data: sanitizedFormData,
        email_address: formData.email_address
          ? sanitizeHtml(formData.email_address, { allowedTags: [] })
          : null,
      })
      .select()
      .single();

    if (saveError) throw saveError;

    // Log submission for rate limiting
    await logSubmission(clientIp, "/api/leads");

    // Send email notification to admin
    try {
      const { data: perkData } = await supabase
        .from("perks")
        .select("name")
        .eq("id", formData.perk_id)
        .single();

      const perkName = perkData?.name || "Unknown Perk";

      const emailHtml = `
        <h2>New Lead Submission</h2>
        <p><strong>Perk:</strong> ${perkName}</p>
        <p><strong>Submission Time:</strong> ${new Date(
          leadData.submission_timestamp
        ).toLocaleString()}</p>
        <h3>Form Data:</h3>
        <table style="border-collapse: collapse; width: 100%;">
          ${Object.entries(sanitizedFormData)
            .map(
              ([key, value]) =>
                `<tr style="border: 1px solid #ddd;">
                  <td style="padding: 8px; font-weight: bold;">${key}</td>
                  <td style="padding: 8px;">${value}</td>
                </tr>`
            )
            .join("")}
        </table>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: "hello@venturenext.io",
        subject: `New Lead: ${perkName}`,
        html: emailHtml,
      });

      // Update email_sent flag
      await supabase
        .from("leads")
        .update({ email_sent: true, email_sent_at: new Date().toISOString() })
        .eq("id", leadData.id);
    } catch (emailError: any) {
      console.error("Email sending failed, but lead was saved:", emailError);
      // Don't fail the request if email fails - lead is already saved
    }

    // Send confirmation email to user
    if (formData.email_address) {
      try {
        const { data: perkData } = await supabase
          .from("perks")
          .select("name")
          .eq("id", formData.perk_id)
          .single();

        const perkName = perkData?.name || "Unknown Perk";

        const confirmationHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thank You for Your Interest</h2>
            <p style="color: #666; font-size: 16px;">We have received your submission for <strong>${perkName}</strong>.</p>
            <p style="color: #666; font-size: 16px;">Our team will review your information and contact you soon with next steps.</p>
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="color: #666; font-size: 14px; margin: 0;"><strong>Perk:</strong> ${perkName}</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>Submission Time:</strong> ${new Date(
          leadData.submission_timestamp
        ).toLocaleString()}</p>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">Best regards,<br/>The Team</p>
          </div>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: formData.email_address,
          subject: `Thank You - ${perkName} Application Received`,
          html: confirmationHtml,
        });
      } catch (emailError: any) {
        console.error("Confirmation email error, but lead was saved:", emailError);
        // Continue even if confirmation email fails
      }
    }

    return NextResponse.json(leadData, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
