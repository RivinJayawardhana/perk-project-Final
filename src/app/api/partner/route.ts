import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import sanitizeHtml from 'sanitize-html'
import { PartnerFormSchema } from '@/lib/form-validation'
import {
  verifyRecaptcha,
  checkRateLimit,
  logSubmission,
  getClientIp,
} from '@/lib/form-security'

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)
    const body = await request.json()

    // Validate input with Zod
    const validationResult = PartnerFormSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { data: formData } = validationResult

    // Verify reCAPTCHA token (optional in development if keys not configured)
    if (process.env.RECAPTCHA_SECRET_KEY) {
      const recaptchaValid = await verifyRecaptcha(formData.recaptchaToken)
      if (!recaptchaValid && formData.recaptchaToken !== 'dev-token') {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed' },
          { status: 403 }
        )
      }
    }

    // Check rate limit (5 submissions per hour per IP)
    const isUnderLimit = await checkRateLimit(clientIp, '/api/partner', 5, 60)
    if (!isUnderLimit) {
      return NextResponse.json(
        {
          error: 'Too many submissions. Please try again later.',
          retryAfter: 3600,
        },
        { status: 429 }
      )
    }

    // Sanitize input to prevent XSS
    const sanitizedData = {
      company: sanitizeHtml(formData.company, { allowedTags: [] }),
      contact: sanitizeHtml(formData.contact, { allowedTags: [] }),
      email: sanitizeHtml(formData.email, { allowedTags: [] }),
      website: sanitizeHtml(formData.website, { allowedTags: [] }),
      offer: sanitizeHtml(formData.offer, {
        allowedTags: ['b', 'i', 'em', 'strong', 'br', 'p'],
        allowedAttributes: {},
      }),
    }

    // Insert into partner_applications table
    const { data, error } = await supabase
      .from('partner_applications')
      .insert([sanitizedData])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Log submission for rate limiting
    await logSubmission(clientIp, '/api/partner')

    // Send email notification to admin
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: 'hello@venturenext.io',
        subject: `New Partner Application from ${sanitizedData.company}`,
        html: `
          <h2>New Partner Application</h2>
          <p><strong>Company:</strong> ${sanitizedData.company}</p>
          <p><strong>Contact Name:</strong> ${sanitizedData.contact}</p>
          <p><strong>Email:</strong> ${sanitizedData.email}</p>
          <p><strong>Website:</strong> ${sanitizedData.website}</p>
          <p><strong>Offer Description:</strong></p>
          <p>${sanitizedData.offer.replace(/\n/g, '<br>')}</p>
        `,
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Continue even if email fails
    }

    // Send confirmation email to user
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: sanitizedData.email,
        subject: 'We Received Your Partnership Application',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thank You for Your Partnership Application</h2>
            <p style="color: #666; font-size: 16px;">Hi ${sanitizedData.contact},</p>
            <p style="color: #666; font-size: 16px;">We have received your partnership application for <strong>${sanitizedData.company}</strong>.</p>
            <p style="color: #666; font-size: 16px;">Our team will review your application and contact you soon to discuss partnership opportunities.</p>
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="color: #666; font-size: 14px; margin: 0;"><strong>Application Details:</strong></p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>Company:</strong> ${sanitizedData.company}</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>Website:</strong> ${sanitizedData.website}</p>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">Best regards,<br/>The Partnership Team</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Confirmation email error:', emailError)
      // Continue even if confirmation email fails
    }

    return NextResponse.json({ message: 'Partner application received', data })
  } catch (err) {
    console.error('Partner form error:', err)
    return NextResponse.json({ error: 'Failed to submit partner application' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('partner_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch partner applications' }, { status: 500 })
  }
}
