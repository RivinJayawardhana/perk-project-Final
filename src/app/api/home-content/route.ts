import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface SEOData {
  metaTitle: string;
  metaDescription: string;
}

interface HomePageContent {
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
  seo?: SEOData;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Default content for fallback
const defaultContent: HomePageContent = {
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
  seo: {
    metaTitle: "VentureNext - Exclusive Perks for Founders & Remote Teams",
    metaDescription: "Discover 500+ exclusive perks and deals for founders, freelancers, and remote teams. Save money on premium tools and services.",
  },
};

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .eq("page_name", "home")
      .order("section_order", { ascending: true });

    if (error) throw error;

    // Transform database rows into structured content
    let content: HomePageContent = defaultContent;

    if (data && data.length > 0) {
      content = {
        hero: { badge: "", title: "", description: "", buttonText1: "", buttonText2: "", heroImages: ["", "", "", "", "", ""] },
        featuredDeals: { title: "" },
        howItWorks: { title: "", subtitle: "", steps: [] },
        insights: { title: "" },
        ctaCards: { card1: { title: "", buttonText: "", description: "" }, card2: { title: "", buttonText: "", description: "" } },
      };

      data.forEach((row: any) => {
        if (row.section_type === "hero") {
          const heroImages = row.metadata?.heroImages || defaultContent.hero.heroImages;
          // Ensure heroImages array has 6 items
          while (heroImages.length < 6) {
            heroImages.push("");
          }
          content.hero = {
            badge: row.title || defaultContent.hero.badge,
            title: row.description || defaultContent.hero.title,
            description: row.content || defaultContent.hero.description,
            buttonText1: row.cta_text || defaultContent.hero.buttonText1,
            buttonText2: row.metadata?.buttonText2 || defaultContent.hero.buttonText2,
            heroImages: heroImages,
          };
        } else if (row.section_type === "featured_deals") {
          content.featuredDeals.title = row.title || defaultContent.featuredDeals.title;
        } else if (row.section_type === "how_it_works") {
          content.howItWorks = {
            title: row.title || defaultContent.howItWorks.title,
            subtitle: row.description || defaultContent.howItWorks.subtitle,
            steps: row.metadata?.steps || defaultContent.howItWorks.steps,
          };
        } else if (row.section_type === "insights") {
          content.insights.title = row.title || defaultContent.insights.title;
        } else if (row.section_type === "cta_card_1") {
          content.ctaCards.card1 = {
            title: row.title || defaultContent.ctaCards.card1.title,
            buttonText: row.cta_text || defaultContent.ctaCards.card1.buttonText,
            description: row.description || defaultContent.ctaCards.card1.description,
          };
        } else if (row.section_type === "cta_card_2") {
          content.ctaCards.card2 = {
            title: row.title || defaultContent.ctaCards.card2.title,
            buttonText: row.cta_text || defaultContent.ctaCards.card2.buttonText,
            description: row.description || defaultContent.ctaCards.card2.description,
          };
        } else if (row.section_type === "seo") {
          content.seo = {
            metaTitle: row.title || defaultContent.seo?.metaTitle || "",
            metaDescription: row.description || defaultContent.seo?.metaDescription || "",
          };
        }
      });
    }

    return NextResponse.json(content);
  } catch (error: any) {
    console.error("GET /api/home-content error:", error);
    // Return default content on error
    return NextResponse.json(defaultContent);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: HomePageContent = await request.json();

    // Validate the structure
    if (!body.hero || !body.ctaCards) {
      return NextResponse.json(
        { error: "Invalid content structure" },
        { status: 400 }
      );
    }

    const sections = [
      {
        page_name: "home",
        section_type: "hero",
        title: body.hero?.badge || "",
        description: body.hero?.title || "",
        content: body.hero?.description || "",
        cta_text: body.hero?.buttonText1 || "",
        metadata: {
          buttonText2: body.hero?.buttonText2 || "",
          heroImages: body.hero?.heroImages || [],
        },
        section_order: 1,
        is_active: true,
      },
      {
        page_name: "home",
        section_type: "featured_deals",
        title: body.featuredDeals?.title || "Featured Deals",
        section_order: 2,
        is_active: true,
      },
      {
        page_name: "home",
        section_type: "how_it_works",
        title: body.howItWorks?.title || "How It Works",
        description: body.howItWorks?.subtitle || "",
        metadata: { steps: body.howItWorks?.steps || [] },
        section_order: 3,
        is_active: true,
      },
      {
        page_name: "home",
        section_type: "insights",
        title: body.insights?.title || "Insights for Founders",
        section_order: 4,
        is_active: true,
      },
      {
        page_name: "home",
        section_type: "cta_card_1",
        title: body.ctaCards?.card1?.title || "",
        description: body.ctaCards?.card1?.description || "",
        cta_text: body.ctaCards?.card1?.buttonText || "",
        section_order: 5,
        is_active: true,
      },
      {
        page_name: "home",
        section_type: "cta_card_2",
        title: body.ctaCards?.card2?.title || "",
        description: body.ctaCards?.card2?.description || "",
        cta_text: body.ctaCards?.card2?.buttonText || "",
        section_order: 6,
        is_active: true,
      },
    ];

    // Delete existing home content
    await supabase.from("page_content").delete().eq("page_name", "home");

    // Add SEO row if present
    if (body.seo) {
      (sections as any[]).push({
        page_name: "home",
        section_type: "seo",
        title: body.seo.metaTitle || "",
        description: body.seo.metaDescription || "",
        content: "",
        section_order: 0,
        is_active: true,
      });
    }

    // Insert new content
    const { data, error } = await supabase
      .from("page_content")
      .insert(sections)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Homepage content updated successfully",
      data: body,
    });
  } catch (error: any) {
    console.error("POST /api/home-content error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save homepage content" },
      { status: 500 }
    );
  }
}
