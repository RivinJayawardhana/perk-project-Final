import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import PartnerForm from "@/components/PartnerForm";

export const revalidate = 60; // ISR: regenerate every minute

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

async function fetchPartnerContent(): Promise<PartnerContent | null> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/partner-content`;
    console.log("[fetchPartnerContent] Fetching from:", url);
    
    const res = await fetch(url, {
      next: { revalidate: 60 }
    });
    
    console.log("[fetchPartnerContent] Response status:", res.status);
    if (!res.ok) {
      console.error("[fetchPartnerContent] Response not OK:", res.status);
      return null;
    }
    
    const data = await res.json();
    console.log("[fetchPartnerContent] Data received successfully");
    return data;
  } catch (error) {
    console.error("[fetchPartnerContent] Error:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchPartnerContent();
  return {
    title: content?.seo?.metaTitle || "Become a Partner - VentureNext",
    description: content?.seo?.metaDescription || "Partner with VentureNext",
    openGraph: {
      url: "https://venturenext.co/partner",
    },
    alternates: {
      canonical: "https://venturenext.co/partner",
    },
  };
}

export default async function Partner() {
  const content = await fetchPartnerContent();

  if (!content) {
    return (
      <>
        <Header />
        <main className="bg-[#fcfaf7] min-h-screen flex items-center justify-center">
          <div className="text-[#6b6f76]">Unable to load partner content</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-[#fcfaf7] min-h-screen">

      {/* Hero Section - Dynamic */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#faf8f6]">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {content.hero.subtitle && <div className="text-[#e6b756] font-semibold mb-2 text-sm sm:text-base font-display">{content.hero.subtitle}</div>}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#23272f] mb-4 sm:mb-6 font-display">{content.hero.title}</h1>
          <p className="text-sm sm:text-base md:text-lg text-[#6b6f76]">{content.hero.description}</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-[#1a2233] py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[#e6b756] font-semibold text-center mb-2 text-sm sm:text-base font-display">{content.benefits.subtitle}</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e6b756] text-center mb-8 sm:mb-10 font-display">{content.benefits.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {content.benefits.cards.map((card, idx) => {
              const icons = [
                // Reach Decision Makers - people/target icon
                <svg key="icon-0" width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="8" cy="8" r="3" stroke="#b48a1e" strokeWidth="1.5"/><path d="M2 22s1.5-4 6-4 6 4 6 4M18 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6M22 22s1.5-2.5 1.5-5" stroke="#b48a1e" strokeWidth="1.5"/></svg>,
                // Acquire Lifelong Customers - heart icon
                <svg key="icon-1" width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#b48a1e" strokeWidth="1.5" fill="none"/></svg>,
                // Zero Cost To You - zap/free icon
                <svg key="icon-2" width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#b48a1e" strokeWidth="1.5" fill="none"/></svg>,
                // Simple Setup - check/easy icon
                <svg key="icon-3" width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="#b48a1e" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
              ];
              
              return (
                <div key={idx} className="bg-[#f8eac7] rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col items-start">
                  <span className="mb-4">{icons[idx] || icons[0]}</span>
                  <div className="text-base sm:text-lg font-semibold text-[#23272f] mb-2 font-display">{card.title}</div>
                  <div className="text-sm sm:text-base text-[#6b6f76]">{card.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-[#f5f3f0] py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[#e86a2a] font-semibold text-center mb-2 text-sm sm:text-base font-display">{content.process.subtitle}</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#23272f] text-center mb-8 sm:mb-10 font-display">{content.process.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {content.process.steps.map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e86a2a] text-white flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 font-display">{item.step}</div>
                <div className="font-semibold text-[#23272f] mb-1 text-base sm:text-lg font-display">{item.title}</div>
                <div className="text-[#6b6f76] text-xs sm:text-sm">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <PartnerForm content={content} />
      </main>
      <Footer />
    </>
  );
}
