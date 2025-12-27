import { useState, useEffect } from "react";

export interface HomePageContent {
  hero: {
    badge: string;
    title: string;
    description: string;
    buttonText1: string;
    buttonText2: string;
    heroImages: string[];
  };
  featuredDeals: {
    title: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: Array<{ title: string; description: string }>;
  };
  insights: {
    title: string;
  };
  ctaCards: {
    card1: { title: string; description: string; buttonText: string };
    card2: { title: string; description: string; buttonText: string };
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };
}

const DEFAULT_CONTENT: HomePageContent = {
  hero: {
    badge: "500+ exclusive perks for founders",
    title: "Perks that fuel your growth",
    description: "Exclusive deals on the tools, services, and experiences that help founders, freelancers, and remote teams thrive.",
    buttonText1: "Explore All Perks",
    buttonText2: "How It Works",
    heroImages: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80",
    ],
  },
  featuredDeals: {
    title: "Top picks this month",
  },
  howItWorks: {
    title: "How it works",
    subtitle: "Get exclusive perks in three simple steps",
    steps: [
      {
        title: "Discover perks",
        description: "Browse hundreds of exclusive deals curated for founders and remote teams.",
      },
      {
        title: "Unlock your discount",
        description: "Click to reveal the deal and get instant access to partner offers.",
      },
      {
        title: "Save & grow",
        description: "Apply your savings to fuel growth with premium tools and services.",
      },
    ],
  },
  insights: {
    title: "Insights for founders",
  },
  ctaCards: {
    card1: {
      title: "For Founders & Teams",
      description: "Access hundreds of exclusive perks to save money and grow your business faster.",
      buttonText: "Explore Perks",
    },
    card2: {
      title: "Become a Partner",
      description: "Reach thousands of decision-makers at startups and growing businesses.",
      buttonText: "Partner With Us",
    },
  },
};

export function useHomeContent() {
  const [content, setContent] = useState<HomePageContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/home-content");
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        } else {
          setContent(DEFAULT_CONTENT);
        }
      } catch (err) {
        console.error("Failed to load home content:", err);
        setContent(DEFAULT_CONTENT);
        setError("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, isLoading, error };
}
