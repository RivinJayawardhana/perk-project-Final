import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

interface PrivacyContent {
  sections: Array<{ id: string; heading: string; slug: string; content: string }>;
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

const DEFAULT_CONTENT: PrivacyContent = {
  sections: [
    {
      id: "1",
      heading: "Privacy Policy",
      slug: "privacy-policy",
      content: "Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.",
    },
    {
      id: "2",
      heading: "Information We Collect",
      slug: "information-we-collect",
      content: "We collect information you provide directly to us, such as when you create an account or contact us.",
    },
    {
      id: "3",
      heading: "How We Use Your Information",
      slug: "how-we-use-your-information",
      content: "We use the information we collect to provide, maintain, and improve our services.",
    },
    {
      id: "4",
      heading: "Data Security",
      slug: "data-security",
      content: "We take reasonable measures to protect your personal information from unauthorized access.",
    },
  ],
  seo: {
    metaTitle: "Privacy Policy | VentureNext",
    metaDescription: "Learn about how VentureNext collects, uses, and protects your personal information.",
  },
  hero: {
    subtitle: "Legal",
    heading: "Privacy & Terms",
    description: "Read our privacy policy and terms of service.",
  },
};

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .eq("page_name", "privacy")
      .order("section_order", { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(DEFAULT_CONTENT);
    }

    // Transform database rows into PrivacyContent interface
    const sections = data
      .filter((row) => row.section_type !== "seo" && row.section_type !== "hero")
      .map((row) => ({
        id: row.id || row.section_order.toString(),
        heading: row.title || "Section",
        slug: row.description || "",
        content: row.content || "",
      }));

    // Get SEO data if available
    const seoRow = data.find((row) => row.section_type === "seo");
    const seo = seoRow
      ? {
          metaTitle: seoRow.title || DEFAULT_CONTENT.seo?.metaTitle || "",
          metaDescription: seoRow.description || DEFAULT_CONTENT.seo?.metaDescription || "",
        }
      : DEFAULT_CONTENT.seo;

    // Get hero data if available
    const heroRow = data.find((row) => row.section_type === "hero");
    const hero = heroRow
      ? {
          subtitle: heroRow.title || DEFAULT_CONTENT.hero?.subtitle || "",
          heading: heroRow.description || DEFAULT_CONTENT.hero?.heading || "",
          description: heroRow.content || DEFAULT_CONTENT.hero?.description || "",
        }
      : DEFAULT_CONTENT.hero;

    return NextResponse.json({ sections, seo, hero });
  } catch (error) {
    console.error("Error fetching privacy content:", error);
    return NextResponse.json(DEFAULT_CONTENT);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PrivacyContent = await request.json();

    // Delete existing privacy page content
    await supabase.from("page_content").delete().eq("page_name", "privacy");

    // Insert new sections
    const rows = body.sections.map((section, index) => ({
      page_name: "privacy",
      section_type: "privacy_section",
      title: section.heading,
      description: section.slug,
      content: section.content,
      section_order: index + 1,
      metadata: { id: section.id },
    }));

    // Add SEO row
    if (body.seo) {
      rows.push({
        page_name: "privacy",
        section_type: "seo",
        title: body.seo.metaTitle,
        description: body.seo.metaDescription,
        content: "",
        section_order: 0,
        metadata: { id: "seo" },
      });
    }

    // Add hero row
    if (body.hero) {
      rows.push({
        page_name: "privacy",
        section_type: "hero",
        title: body.hero.subtitle,
        description: body.hero.heading,
        content: body.hero.description,
        section_order: -1,
        metadata: { id: "hero" },
      });
    }

    const { error } = await supabase.from("page_content").insert(rows);

    if (error) throw error;

    return NextResponse.json({ success: true, content: body });
  } catch (error) {
    console.error("Error saving privacy content:", error);
    return NextResponse.json(
      { error: "Failed to save content", details: error instanceof Error ? error.message : "" },
      { status: 400 }
    );
  }
}
