import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import ContactFormClient from "@/components/ContactFormClient";

export const revalidate = 60; // ISR: regenerate every minute

interface ContactContent {
  hero?: {
    subtitle?: string;
    title: string;
    description: string;
  };
  contactInfo?: {
    email: string;
    phone: string;
    location: string;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };
}

const getBaseUrl = () => {
  // Production - use env variables
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Development - use relative URL (works on any port)
  return "";
};

async function fetchContactContent(): Promise<ContactContent | null> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/contact-content`;
    
    const res = await fetch(url, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    
    // Always ensure contactInfo exists with defaults
    const sanitizedData: ContactContent = {
      ...data,
      contactInfo: data.contactInfo || {
        email: "support@venturenext.co",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA"
      }
    };
    
    return sanitizedData;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchContactContent();
  return {
    title: content?.seo?.metaTitle || "Contact Us - VentureNext",
    description: content?.seo?.metaDescription || "Get in touch with VentureNext. We'd love to hear from you.",
    openGraph: {
      url: "https://venturenext.io/contact",
    },
    alternates: {
      canonical: "https://venturenext.io/contact",
    },
  };
}

export default async function Contact() {
  const content = await fetchContactContent();
  
  // Use contactInfo from content or fallback to defaults
  const contactInfo = content?.contactInfo || {
    email: "support@venturenext.co",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA"
  };

  return (
    <>
      <script async src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}></script>
      <Header />
      <main className="bg-[#fcfaf7] min-h-screen py-0">
        {/* Hero Section - Dynamic */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#faf8f6]">
          <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            {content?.hero?.subtitle && <div className="text-[#e6b756] font-semibold mb-2 text-sm sm:text-base font-display">{content.hero.subtitle}</div>}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#23272f] mb-4 sm:mb-6 font-display">{content?.hero?.title || "We'd love to hear from you"}</h1>
            <p className="text-sm sm:text-base md:text-lg text-[#6b6f76]">{content?.hero?.description || "Whether you have a question about perks, partnerships, or anything else—our team is ready to help."}</p>
          </div>
        </section>
        <ContactFormClient />
      </main>
      <Footer />
    </>
  );
}