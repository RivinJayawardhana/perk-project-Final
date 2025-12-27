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
  seo?: SEOData;
}

const DEFAULT_CONTENT: PartnerContent = {
  hero: {
    subtitle: "Partner with us",
    title: "Reach the founders building tomorrow",
    description: "Join 200+ brands offering exclusive perks to our community of 50,000+ founders, freelancers, and remote teams.",
    buttonText: "Become a Partner →",
  },
  benefits: {
    subtitle: "Why partner with us",
    title: "Benefits for your brand",
    cards: [
      {
        title: "Reach Decision Makers",
        description: "Connect with founders, CTOs, and team leads actively looking for solutions.",
      },
      {
        title: "Drive Conversions",
        description: "Our audience is ready to buy—they just need the right incentive.",
      },
      {
        title: "Build Brand Loyalty",
        description: "Create lasting relationships with high-growth companies from day one.",
      },
      {
        title: "Global Exposure",
        description: "Reach a worldwide audience of remote workers and digital nomads.",
      },
    ],
  },
  process: {
    subtitle: "How it works",
    title: "Simple partnership process",
    steps: [
      { step: "01", title: "Apply", description: "Fill out the form with your offer details." },
      { step: "02", title: "Review", description: "We review within 24 hours." },
      { step: "03", title: "Launch", description: "Your perk goes live to our audience." },
      { step: "04", title: "Grow", description: "Track and optimize performance." },
    ],
  },
  form: {
    subtitle: "Get started",
    title: "Apply to become a partner",
    description: "Fill out the form below and we'll get back to you within 24 hours.",
  },
  seo: {
    metaTitle: "Partner With VentureNext - Reach Founders & Remote Teams",
    metaDescription: "Become a VentureNext partner and reach 50,000+ founders, freelancers, and remote teams. Drive conversions with exclusive perks.",
  },
};

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .eq("page_name", "partner")
      .order("section_order", { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(DEFAULT_CONTENT);
    }

    // Transform database rows into PartnerContent interface
    const content: PartnerContent = DEFAULT_CONTENT;

    for (const row of data) {
      if (row.section_type === "hero") {
        content.hero = {
          subtitle: row.title || DEFAULT_CONTENT.hero.subtitle,
          title: row.description || DEFAULT_CONTENT.hero.title,
          description: row.content || DEFAULT_CONTENT.hero.description,
          buttonText: row.cta_text || DEFAULT_CONTENT.hero.buttonText,
        };
      } else if (row.section_type === "benefits") {
        content.benefits = {
          subtitle: row.title || DEFAULT_CONTENT.benefits.subtitle,
          title: row.description || DEFAULT_CONTENT.benefits.title,
          cards: row.metadata?.cards || DEFAULT_CONTENT.benefits.cards,
        };
      } else if (row.section_type === "process") {
        content.process = {
          subtitle: row.title || DEFAULT_CONTENT.process.subtitle,
          title: row.description || DEFAULT_CONTENT.process.title,
          steps: row.metadata?.steps || DEFAULT_CONTENT.process.steps,
        };
      } else if (row.section_type === "form") {
        content.form = {
          subtitle: row.title || DEFAULT_CONTENT.form.subtitle,
          title: row.description || DEFAULT_CONTENT.form.title,
          description: row.content || DEFAULT_CONTENT.form.description,
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
    console.error("Error fetching partner content:", error);
    return NextResponse.json(DEFAULT_CONTENT);
  }
}

export async function POST(request: NextRequest) {
  try {
    const content: PartnerContent = await request.json();

    // Delete existing partner page content
    await supabase.from("page_content").delete().eq("page_name", "partner");

    // Insert new sections
    const rows = [
      {
        page_name: "partner",
        section_type: "hero",
        title: content.hero.subtitle,
        description: content.hero.title,
        content: content.hero.description,
        cta_text: content.hero.buttonText,
        section_order: 1,
      },
      {
        page_name: "partner",
        section_type: "benefits",
        title: content.benefits.subtitle,
        description: content.benefits.title,
        content: "",
        metadata: { cards: content.benefits.cards },
        section_order: 2,
      },
      {
        page_name: "partner",
        section_type: "process",
        title: content.process.subtitle,
        description: content.process.title,
        content: "",
        metadata: { steps: content.process.steps },
        section_order: 3,
      },
      {
        page_name: "partner",
        section_type: "form",
        title: content.form.subtitle,
        description: content.form.title,
        content: content.form.description,
        section_order: 4,
      },
    ];

    // Add SEO row if present
    if (content.seo) {
      rows.push({
        page_name: "partner",
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
    console.error("Error saving partner content:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}
