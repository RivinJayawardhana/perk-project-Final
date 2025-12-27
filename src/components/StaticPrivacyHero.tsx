"use client";

import { useState, useEffect } from "react";

interface HeroData {
  subtitle: string;
  heading: string;
  description: string;
}

interface StaticPrivacyHeroProps {
  data?: HeroData;
}

export default function StaticPrivacyHero({ data }: StaticPrivacyHeroProps) {
  const [hero, setHero] = useState<HeroData>({
    subtitle: "Legal",
    heading: "Privacy & Terms",
    description: "Read our privacy policy and terms of service.",
  });
  const [isLoading, setIsLoading] = useState(!data);

  useEffect(() => {
    if (data) {
      setHero(data);
      setIsLoading(false);
      return;
    }

    const fetchHero = async () => {
      try {
        // Try to fetch from privacy-content endpoint
        const res = await fetch("/api/privacy-content");
        if (res.ok) {
          const fetchedData = await res.json();
          if (fetchedData.hero) {
            setHero(fetchedData.hero);
          }
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHero();
  }, [data]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#faf8f6]">
      <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="text-[#e6b756] font-semibold mb-2 text-sm sm:text-base font-display">
          {hero.subtitle}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#23272f] mb-4 sm:mb-6 font-display">
          {hero.heading}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#6b6f76]">
          {hero.description}
        </p>
      </div>
    </section>
  );
}
