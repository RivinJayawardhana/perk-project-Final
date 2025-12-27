import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

interface SEOData {
  metaTitle: string;
  metaDescription: string;
}

interface AboutPageContent {
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
  seo?: SEOData;
}

const DEFAULT_CONTENT: AboutPageContent = {
  hero: {
    subtitle: "About VentureNext",
    title: "Empowering founders to build faster",
    description:
      "We believe every founder deserves access to premium tools and services without breaking the bank. That's why we built VentureNext.",
  },
  stats: [
    { value: "500+", label: "Exclusive Perks" },
    { value: "50K+", label: "Active Users" },
    { value: "$2M+", label: "Saved by Users" },
    { value: "200+", label: "Partner Brands" },
  ],
  whatWeDo: {
    subtitle: "What we do",
    title: "Connecting founders with value",
    description:
      "VentureNext is the marketplace where ambition meets opportunity.",
    features: [
      {
        title: "Curate Premium Perks",
        description:
          "We handpick and negotiate exclusive deals with top-tier brands across B2B services, SaaS/AI tools, and lifestyle categories.",
      },
      {
        title: "Build Partnerships",
        description:
          "We connect ambitious founders with brands that want to support the next generation of businesses.",
      },
      {
        title: "Deliver Instant Value",
        description:
          "No complicated sign-ups. Find a perk, click, and start saving immediately on tools you actually need.",
      },
    ],
  },
  whoWeServe: {
    subtitle: "Who we serve",
    title: "Built for builders",
    description:
      "Our community includes the most ambitious people creating the future of work.",
    audiences: [
      {
        title: "Startup Founders",
        description:
          "Early-stage to growth-stage founders looking for tools to scale without breaking the budget.",
      },
      {
        title: "Freelancers",
        description:
          "Independent professionals seeking premium services at discounted rates.",
      },
      {
        title: "Solopreneurs",
        description:
          "Solo business owners who need enterprise-level tools at startup-friendly prices.",
      },
      {
        title: "Remote Teams",
        description:
          "Distributed teams looking for coworking spaces, coliving, and productivity tools.",
      },
    ],
  },
  cta: {
    title: "Ready to start saving?",
    description:
      "Join thousands of founders already using VentureNext to unlock exclusive perks.",
    buttonText: "Explore Perks",
  },
  seo: {
    metaTitle: "About VentureNext - Empowering Founders",
    metaDescription: "Learn about VentureNext and how we're connecting founders with premium perks and exclusive deals to help businesses grow.",
  },
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .eq("page_name", "about")
      .order("section_order", { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(DEFAULT_CONTENT);
    }

    // Transform database rows into AboutPageContent interface
    const content: AboutPageContent = DEFAULT_CONTENT;

    for (const row of data) {
      if (row.section_type === "hero") {
        content.hero = {
          subtitle: row.title || DEFAULT_CONTENT.hero.subtitle,
          title: row.description || DEFAULT_CONTENT.hero.title,
          description: row.content || DEFAULT_CONTENT.hero.description,
        };
      } else if (row.section_type === "stats") {
        content.stats = row.metadata?.stats || DEFAULT_CONTENT.stats;
      } else if (row.section_type === "what_we_do") {
        content.whatWeDo = {
          subtitle: row.title || DEFAULT_CONTENT.whatWeDo.subtitle,
          title: row.description || DEFAULT_CONTENT.whatWeDo.title,
          description: row.content || DEFAULT_CONTENT.whatWeDo.description,
          features: row.metadata?.features || DEFAULT_CONTENT.whatWeDo.features,
        };
      } else if (row.section_type === "who_we_serve") {
        content.whoWeServe = {
          subtitle: row.title || DEFAULT_CONTENT.whoWeServe.subtitle,
          title: row.description || DEFAULT_CONTENT.whoWeServe.title,
          description: row.content || DEFAULT_CONTENT.whoWeServe.description,
          audiences:
            row.metadata?.audiences || DEFAULT_CONTENT.whoWeServe.audiences,
        };
      } else if (row.section_type === "cta") {
        content.cta = {
          title: row.title || DEFAULT_CONTENT.cta.title,
          description: row.description || DEFAULT_CONTENT.cta.description,
          buttonText: row.cta_text || DEFAULT_CONTENT.cta.buttonText,
        };
      } else if (row.section_type === "seo") {
        content.seo = {
          metaTitle: row.title || DEFAULT_CONTENT.seo?.metaTitle || "",
          metaDescription: row.description || DEFAULT_CONTENT.seo?.metaDescription || "",
        };
      }
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching about content:", error);
    return NextResponse.json(DEFAULT_CONTENT);
  }
}

export async function POST(request: NextRequest) {
  try {
    const content: AboutPageContent = await request.json();

    // Delete existing about page content
    await supabase.from("page_content").delete().eq("page_name", "about");

    // Insert new sections
    const rows = [
      {
        page_name: "about",
        section_type: "hero",
        title: content.hero.subtitle,
        description: content.hero.title,
        content: content.hero.description,
        section_order: 1,
      },
      {
        page_name: "about",
        section_type: "stats",
        title: "Statistics",
        description: "",
        content: "",
        metadata: { stats: content.stats },
        section_order: 2,
      },
      {
        page_name: "about",
        section_type: "what_we_do",
        title: content.whatWeDo.subtitle,
        description: content.whatWeDo.title,
        content: content.whatWeDo.description,
        metadata: { features: content.whatWeDo.features },
        section_order: 3,
      },
      {
        page_name: "about",
        section_type: "who_we_serve",
        title: content.whoWeServe.subtitle,
        description: content.whoWeServe.title,
        content: content.whoWeServe.description,
        metadata: { audiences: content.whoWeServe.audiences },
        section_order: 4,
      },
      {
        page_name: "about",
        section_type: "cta",
        title: content.cta.title,
        description: content.cta.description,
        cta_text: content.cta.buttonText,
        section_order: 5,
      },
    ];

    // Add SEO row if present
    if (content.seo) {
      rows.push({
        page_name: "about",
        section_type: "seo",
        title: content.seo.metaTitle || "",
        description: content.seo.metaDescription || "",
        content: "",
        section_order: 0,
      });
    }

    const { error } = await supabase
      .from("page_content")
      .insert(rows);

    if (error) throw error;

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Error saving about content:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}
