import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import sanitizeHtml from 'sanitize-html'
import { ContactFormSchema } from '@/lib/form-validation'
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
    
    console.log('Contact form submission - raw body:', body)

    // Validate input with Zod
    const validationResult = ContactFormSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('Validation error:', validationResult.error.errors)
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
    const isUnderLimit = await checkRateLimit(clientIp, '/api/contact', 5, 60)
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
      name: sanitizeHtml(formData.name, { allowedTags: [] }),
      email: sanitizeHtml(formData.email, { allowedTags: [] }),
      subject: sanitizeHtml(formData.subject, { allowedTags: [] }),
      message: sanitizeHtml(formData.message, {
        allowedTags: ['b', 'i', 'em', 'strong', 'br', 'p'],
        allowedAttributes: {},
      }),
    }

    // Save to database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([sanitizedData])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Log submission for rate limiting
    await logSubmission(clientIp, '/api/contact')

    // Send email notification to admin
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: 'hello@venturenext.io',
        subject: `New Contact Form Submission from ${sanitizedData.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${sanitizedData.name}</p>
          <p><strong>Email:</strong> ${sanitizedData.email}</p>
          <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
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
        subject: 'We Received Your Message',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thank You for Contacting Us</h2>
            <p style="color: #666; font-size: 16px;">Hi ${sanitizedData.name},</p>
            <p style="color: #666; font-size: 16px;">We have received your message and appreciate you reaching out to us.</p>
            <p style="color: #666; font-size: 16px;">Our team will review your message and get back to you as soon as possible.</p>
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="color: #666; font-size: 14px; margin: 0;"><strong>Your Message Details:</strong></p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>Subject:</strong> ${sanitizedData.subject}</p>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">Best regards,<br/>The Team</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Confirmation email error:', emailError)
      // Continue even if confirmation email fails
    }

    return NextResponse.json({ message: 'Contact submission received', data })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}
