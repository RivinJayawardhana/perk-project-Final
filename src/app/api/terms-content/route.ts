import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

interface TermsContent {
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

const DEFAULT_CONTENT: TermsContent = {
  sections: [
    {
      id: "1",
      heading: "Terms of Service",
      slug: "terms-of-service",
      content: "Welcome to VentureNext. Please read these Terms of Service carefully before using our platform.",
    },
    {
      id: "2",
      heading: "User Accounts",
      slug: "user-accounts",
      content: "When you create an account with VentureNext, you must provide accurate, complete information. You are responsible for maintaining the confidentiality of your account credentials.",
    },
    {
      id: "3",
      heading: "Acceptable Use",
      slug: "acceptable-use",
      content: "You agree not to use VentureNext for any unlawful purpose or in any way that could damage, disable, overburden, or impair the service.",
    },
    {
      id: "4",
      heading: "Intellectual Property",
      slug: "intellectual-property",
      content: "All content, features, and functionality of VentureNext are owned by VentureNext, its licensors, or other providers of such material.",
    },
    {
      id: "5",
      heading: "Limitation of Liability",
      slug: "limitation-of-liability",
      content: "To the fullest extent permitted by law, VentureNext shall not be liable for any indirect, incidental, special, consequential, or punitive damages.",
    },
  ],
  seo: {
    metaTitle: "Terms of Service | VentureNext",
    metaDescription: "Read our Terms of Service to understand the rules and guidelines for using VentureNext.",
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
      .eq("page_name", "terms")
      .order("section_order", { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(DEFAULT_CONTENT);
    }

    // Transform database rows into TermsContent interface
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
    console.error("Error fetching terms content:", error);
    return NextResponse.json(DEFAULT_CONTENT);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TermsContent = await request.json();

    // Delete existing terms page content
    await supabase.from("page_content").delete().eq("page_name", "terms");

    // Insert new sections
    const rows = body.sections.map((section, index) => ({
      page_name: "terms",
      section_type: "terms_section",
      title: section.heading,
      description: section.slug,
      content: section.content,
      section_order: index + 1,
      metadata: { id: section.id },
    }));

    // Add SEO row
    if (body.seo) {
      rows.push({
        page_name: "terms",
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
        page_name: "terms",
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
    console.error("Error saving terms content:", error);
    return NextResponse.json(
      { error: "Failed to save content", details: error instanceof Error ? error.message : "" },
      { status: 400 }
    );
  }
}
