import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const revalidate = 60; // ISR: regenerate every minute

interface AboutContent {
  hero: {
    subtitle: string;
    title: string;
    description: string;
  };
  stats: Array<{ value: string; label: string }>;
  whatWeDo: {
    subtitle: string;
    title: string;
    description: string;
    features: Array<{ title: string; description: string }>;
  };
  whoWeServe: {
    subtitle: string;
    title: string;
    description: string;
    audiences: Array<{ title: string; description: string }>;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
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

async function fetchAboutContent(): Promise<AboutContent | null> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/about-content`;
    console.log("[fetchAboutContent] Fetching from:", url);
    
    const res = await fetch(url, {
      next: { revalidate: 60 }
    });
    
    console.log("[fetchAboutContent] Response status:", res.status);
    if (!res.ok) {
      console.error("[fetchAboutContent] Response not OK:", res.status);
      return null;
    }
    
    const data = await res.json();
    console.log("[fetchAboutContent] Data received successfully");
    return data;
  } catch (error) {
    console.error("[fetchAboutContent] Error:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchAboutContent();
  return {
    title: content?.seo?.metaTitle || "About VentureNext",
    description: content?.seo?.metaDescription || "Learn about VentureNext and our mission",    openGraph: {
      url: "https://venturenext.co/about",
    },
    alternates: {
      canonical: "https://venturenext.co/about",
    },  };
}

export default async function About() {
  const content = await fetchAboutContent();

  if (!content) {
    return (
      <>
        <Header />
        <main className="bg-[#fcfaf7] min-h-screen">
          <section className="py-16 sm:py-20 lg:py-24 bg-[#faf8f6]">
            <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#23272f] mb-4 sm:mb-6 font-display">About Us</h1>
              <p className="text-sm sm:text-base md:text-lg text-[#6b6f76]">Unable to load content</p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-[#fcfaf7]">
      {/* Hero Section - Dynamic */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#f5f3f0]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {content.hero.subtitle && <div className="text-[#e6b756] font-semibold mb-2 text-sm sm:text-base font-display">{content.hero.subtitle}</div>}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#23272f] mb-4 sm:mb-6 font-display">{content.hero.title}</h1>
          <p className="text-sm sm:text-base md:text-lg text-[#6b6f76]">{content.hero.description}</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#1a2233] py-10 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center px-4 sm:px-6 lg:px-8">
          {content.stats.map((stat, idx) => (
            <div key={idx}>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e6b756] mb-1 sm:mb-2 font-display">{stat.value}</div>
            <div className="text-[#e6b756] text-opacity-80 text-xs sm:text-sm">{stat.label}</div>
          </div>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#f5f3f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-2 sm:mb-3 text-[#e6b756] font-semibold text-center text-sm sm:text-base font-display">{content.whatWeDo.subtitle}</div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#23272f] text-center mb-2 sm:mb-4 font-display">{content.whatWeDo.title}</h2>
        <p className="text-[#6b6f76] text-center mb-8 sm:mb-10 text-sm sm:text-base">{content.whatWeDo.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {content.whatWeDo.features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            <span className="bg-[#f8eac7] text-[#b48a1e] rounded-full p-2 sm:p-3 mb-3 sm:mb-4"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#b48a1e" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" stroke="#b48a1e" strokeWidth="1.5"/></svg></span>

              <div className="text-base sm:text-lg font-semibold mb-2 font-display">{feature.title}</div>
            <div className="text-[#6b6f76] text-center text-sm sm:text-base">{feature.description}</div>
          </div>
          ))}
        </div>
      </div>
      </section>

      {/* Who we serve */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mb-2 sm:mb-3 text-[#e6b756] font-semibold text-center text-sm sm:text-base font-display">{content.whoWeServe.subtitle}</div>
       
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#23272f] text-center mb-2 sm:mb-4 font-display">{content.whoWeServe.title}</h2>
        <p className="text-[#6b6f76] text-center mb-8 sm:mb-10 text-sm sm:text-base">{content.whoWeServe.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {content.whoWeServe.audiences.map((audience, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            <span className="bg-[#f8eac7] text-[#b48a1e] rounded-full p-2 sm:p-3 mb-3 sm:mb-4"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9Z" stroke="#b48a1e" strokeWidth="1.5"/><path d="M8.5 11.5a3.5 3.5 0 0 1 7 0c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5Z" stroke="#b48a1e" strokeWidth="1.5"/></svg></span>
      
              <div className="text-base sm:text-lg font-semibold mb-2 font-display">{audience.title}</div>
            <div className="text-[#6b6f76] text-center text-sm sm:text-base">{audience.description}</div>
          </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="bg-[#1a2233] rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col items-center text-white text-center">
         
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 font-display">{content.cta.title}</h2>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base text-[#e6b756]">{content.cta.description}</p>
          <Link href="/perks">
            <Button className="bg-[#e6b756] text-[#1a2233] font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#f5d488] w-full sm:w-auto">{content.cta.buttonText}</Button>
          </Link>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
