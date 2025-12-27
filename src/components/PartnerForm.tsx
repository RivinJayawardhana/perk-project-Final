"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { setMetaTags } from "@/lib/meta-tags";

// Format website URL - allow users to enter without www or https://
const formatWebsite = (url: string): string => {
  if (!url.trim()) return url;
  let formatted = url.trim().toLowerCase();
  // Remove https:// or http://
  formatted = formatted.replace(/^https?:\/\//, '');
  // Remove www.
  formatted = formatted.replace(/^www\./, '');
  // Add https:// back
  return `https://${formatted}`;
};

interface PartnerContent {
  hero: {
    subtitle: string;
    title: string;
    description: string;
    buttonText: string;
  };
  benefits: {
    subtitle: string;
    title: string;
    cards: Array<{ title: string; description: string }>;
  };
  process: {
    subtitle: string;
    title: string;
    steps: Array<{ step: string; title: string; description: string }>;
  };
  form: {
    subtitle: string;
    title: string;
    description: string;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };
}

export default function PartnerForm({ content }: { content: PartnerContent }) {
  const { toast } = useToast();
  const { getToken } = useRecaptcha();
  const [form, setForm] = useState({
    company: "",
    contact: "",
    email: "",
    website: "",
    offer: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    document.head.appendChild(script);

    // Set meta tags when content loads
    if (content?.seo) {
      setMetaTags(content.seo.metaTitle, content.seo.metaDescription);
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get reCAPTCHA token (optional for development)
      let token: string = 'dev-token';
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        const captchaToken = await getToken('partner_form');
        if (!captchaToken) {
          throw new Error('reCAPTCHA verification failed');
        }
        token = captchaToken;
      }

      const response = await fetch('/api/partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        ...form,
        website: formatWebsite(form.website),
        recaptchaToken: token
      }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Extract specific validation error messages
        if (errorData.details && Array.isArray(errorData.details)) {
          const errorMessages = errorData.details
            .map((err: any) => err.message)
            .join(', ');
          throw new Error(errorMessages);
        }
        
        throw new Error(errorData.error || 'Failed to submit application');
      }

      toast({
        title: "Success!",
        description: "Thank you for your application. We'll review it and get back to you soon.",
      });

      setSubmitted(true);
      setForm({ company: '', contact: '', email: '', website: '', offer: '' });
      setTimeout(() => setSubmitted(false), 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="apply" className="py-16 sm:py-20 lg:py-24 bg-[#fcfaf7]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-[#e6b756] font-semibold text-center mb-2 text-sm sm:text-base font-display">{content.form.subtitle}</div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#23272f] text-center mb-3 sm:mb-4 font-display">{content.form.title}</h2>
        <p className="text-[#6b6f76] text-center mb-6 sm:mb-8 text-sm sm:text-base">{content.form.description}</p>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Input name="company" placeholder="Company Name" value={form.company} onChange={handleChange} required className="flex-1" />
            <Input name="contact" placeholder="Contact Name" value={form.contact} onChange={handleChange} required className="flex-1" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="flex-1" type="email" />
            <Input name="website" placeholder="Website" value={form.website} onChange={handleChange} required className="flex-1" />
          </div>
          <Textarea name="offer" placeholder="Describe your product and the perk you'd like to offer..." value={form.offer} onChange={handleChange} required rows={4} />
          <Button type="submit" className="bg-[#e6b756] text-[#1a2233] font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#f5d488] font-display w-full sm:w-auto" disabled={submitted || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : submitted ? (
              "Submitted!"
            ) : (
              "Submit Application"
            )}
          </Button>

          <p className="text-xs text-[#999] text-center">
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and{" "}
            <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
          </p>
        </form>
      </div>
    </section>
  );
}
