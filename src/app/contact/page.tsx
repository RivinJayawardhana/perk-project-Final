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
    console.log("[fetchContactContent] Fetching from:", url);
    
    const res = await fetch(url, {
      next: { revalidate: 60 }
    });
    
    console.log("[fetchContactContent] Response status:", res.status);
    
    if (!res.ok) {
      console.error("[fetchContactContent] Response not OK:", res.status, res.statusText);
      return null;
    }
    
    const data = await res.json();
    console.log("[fetchContactContent] Full Data received:", JSON.stringify(data, null, 2));
    console.log("[fetchContactContent] Has contactInfo key:", 'contactInfo' in data);
    console.log("[fetchContactContent] contactInfo value:", data?.contactInfo);
    console.log("[fetchContactContent] All response keys:", Object.keys(data));
    
    // Check if contactInfo exists in response (even if null/undefined)
    if (!data.contactInfo) {
      console.warn("[fetchContactContent] WARNING: contactInfo is missing or undefined in API response!");
      console.warn("[fetchContactContent] Data structure:", data);
    }
    
    // Always ensure contactInfo exists with defaults
    const sanitizedData: ContactContent = {
      ...data,
      contactInfo: data.contactInfo || {
        email: "support@venturenext.co",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA"
      }
    };
    
    console.log("[fetchContactContent] Sanitized contactInfo:", sanitizedData.contactInfo);
    return sanitizedData;
  } catch (error) {
    console.error("[fetchContactContent] Error:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchContactContent();
  return {
    title: content?.seo?.metaTitle || "Contact Us - VentureNext",
    description: content?.seo?.metaDescription || "Get in touch with VentureNext. We'd love to hear from you.",
    openGraph: {
      url: "https://venturenext.co/contact",
    },
    alternates: {
      canonical: "https://venturenext.co/contact",
    },
  };
}

export default async function Contact() {
  const content = await fetchContactContent();

  console.log("[Contact Page] Full content received:", content);
  
  // Use contactInfo from content or fallback to defaults
  const contactInfo = content?.contactInfo || {
    email: "support@venturenext.co",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA"
  };

  console.log("[Contact Page] Final contactInfo to display:", contactInfo);

  return (
    <>
      <script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}></script>
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