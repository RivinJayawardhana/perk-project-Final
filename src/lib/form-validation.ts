import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name is too short (minimum 2 characters)').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject is too short (minimum 3 characters)').max(200),
  message: z.string().min(5, 'Message is too short (minimum 5 characters)').max(5000),
  recaptchaToken: z.string().min(1, 'reCAPTCHA verification failed'),
})

export const PartnerFormSchema = z.object({
  company: z.string().min(2, 'Company name is too short (minimum 2 characters)').max(100),
  contact: z.string().min(2, 'Contact name is too short (minimum 2 characters)').max(100),
  email: z.string().email('Please enter a valid email address'),
  website: z.string().url('Please enter a valid website URL').max(500),
  offer: z.string().min(5, 'Offer description is too short (minimum 5 characters)').max(5000),
  recaptchaToken: z.string().min(1, 'reCAPTCHA verification failed'),
})

export const LeadFormSchema = z.object({
  perk_id: z.string().uuid('Invalid perk ID'),
  lead_form_id: z.string().uuid('Invalid lead form ID').optional(),
  form_data: z.record(z.any()).refine(
    (data) => Object.keys(data).length > 0,
    'Form data cannot be empty'
  ),
  email_address: z.string().email('Invalid email address').optional(),
  recaptchaToken: z.string().min(1, 'reCAPTCHA verification failed'),
})

export type ContactFormType = z.infer<typeof ContactFormSchema>
export type PartnerFormType = z.infer<typeof PartnerFormSchema>
export type LeadFormType = z.infer<typeof LeadFormSchema>
