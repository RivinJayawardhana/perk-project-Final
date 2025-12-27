import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import StaticPrivacyHero from "@/components/StaticPrivacyHero";
import PrivacyTabContent from "@/components/PrivacyTabContent";

export const revalidate = 60; // ISR: regenerate every minute

interface Section {
  id: string;
  heading: string;
  slug: string;
  content: string;
}

interface ContentData {
  sections: Section[];
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };
  hero?: {
    subtitle: string;
    heading: string;
    description: string;
  };
}

const getBaseUrl = () => {
  // Use NEXT_PUBLIC_APP_URL if available (most reliable for Vercel)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Fallback to VERCEL_URL (Vercel provides this at runtime)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Local development
  return "http://localhost:3000";
};

async function fetchPrivacyContent(): Promise<ContentData | null> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/privacy-content`;
    console.log("[fetchPrivacyContent] Fetching from:", url);
    
    const res = await fetch(url, {
      next: { revalidate: 60 }
    });
    
    console.log("[fetchPrivacyContent] Response status:", res.status);
    if (!res.ok) {
      console.error("[fetchPrivacyContent] Response not OK:", res.status);
      return null;
    }
    
    const data = await res.json();
    console.log("[fetchPrivacyContent] Data received successfully");
    return data;
  } catch (error) {
    console.error("[fetchPrivacyContent] Error:", error);
    return null;
  }
}

async function fetchTermsContent(): Promise<ContentData | null> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/terms-content`;
    console.log("[fetchTermsContent] Fetching from:", url);
    
    const res = await fetch(url, {
      next: { revalidate: 60 }
    });
    
    console.log("[fetchTermsContent] Response status:", res.status);
    if (!res.ok) {
      console.error("[fetchTermsContent] Response not OK:", res.status);
      return null;
    }
    
    const data = await res.json();
    console.log("[fetchTermsContent] Data received successfully");
    return data;
  } catch (error) {
    console.error("[fetchTermsContent] Error:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchPrivacyContent();
  return {
    title: content?.seo?.metaTitle || "Privacy Policy - VentureNext",
    description: content?.seo?.metaDescription || "Read our privacy policy",
    openGraph: {
      url: "https://venturenext.co/privacy",
    },
    alternates: {
      canonical: "https://venturenext.co/privacy",
    },
  };
}

export default async function Privacy() {
  const [privacyContent, termsContent] = await Promise.all([
    fetchPrivacyContent(),
    fetchTermsContent(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <StaticPrivacyHero data={privacyContent?.hero} />
      <PrivacyTabContent initialPrivacy={privacyContent} initialTerms={termsContent} />
      <Footer />
    </div>
  );
}
