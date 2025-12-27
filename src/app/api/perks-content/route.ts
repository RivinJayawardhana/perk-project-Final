import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface SEOData {
  metaTitle: string;
  metaDescription: string;
}

interface PerksPageContent {
  hero: {
    title: string;
    description: string;
  };
  seo?: SEOData;
}

const DEFAULT_CONTENT: PerksPageContent = {
  hero: {
    title: "Discover your next perk",
    description: "Browse 500+ exclusive deals on tools, services, and experiences for founders and teams.",
  },
  seo: {
    metaTitle: "Exclusive Perks for Founders | VentureNext",
    metaDescription: "Browse 500+ exclusive perks and deals tailored for founders, freelancers, and remote teams. Save on the tools you need.",
  },
};

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .eq("page_name", "perks")
      .order("section_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.log("No perks content found, returning defaults");
      return NextResponse.json(DEFAULT_CONTENT);
    }

    const content: PerksPageContent = DEFAULT_CONTENT;

    for (const row of data) {
      if (row.section_type === "hero") {
        content.hero = {
          title: row.title || DEFAULT_CONTENT.hero.title,
          description: row.description || DEFAULT_CONTENT.hero.description,
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
    console.error("Error fetching perks content:", error);
    return NextResponse.json(DEFAULT_CONTENT);
  }
}

export async function POST(request: NextRequest) {
  try {
    const content: PerksPageContent = await request.json();

    // Delete existing perks content
    await supabase
      .from("page_content")
      .delete()
      .eq("page_name", "perks");

    const rows: any[] = [
      {
        page_name: "perks",
        section_type: "hero",
        title: content.hero.title,
        description: content.hero.description,
        content: "",
        section_order: 1,
      },
    ];

    // Add SEO row if present
    if (content.seo) {
      rows.push({
        page_name: "perks",
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
    console.error("Error saving perks content:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}
