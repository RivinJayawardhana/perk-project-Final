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

interface ContactPageContent {
  hero: {
    subtitle: string;
    title: string;
    description: string;
  };
  contactInfo?: {
    email: string;
    phone: string;
    location: string;
  };
  seo?: SEOData;
}

const DEFAULT_CONTENT: ContactPageContent = {
  hero: {
    subtitle: "Contact us",
    title: "We'd love to hear from you",
    description: "Whether you have a question about perks, partnerships, or anything else—our team is ready to help.",
  },
  contactInfo: {
    email: "support@venturenext.co",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
  },
  seo: {
    metaTitle: "Contact VentureNext - Get in Touch",
    metaDescription: "Have questions about VentureNext? Contact our team and we'll be happy to help with any inquiries.",
  },
};

export async function GET(request: NextRequest) {
  try {
    console.log("[contact-content GET] === START ===");
    
    const { data: rows, error } = await supabase
      .from("page_content")
      .select("*")
      .eq("page_name", "contact")
      .order("section_order", { ascending: true });

    console.log("[contact-content GET] Query error:", error);
    console.log("[contact-content GET] Total rows:", rows?.length);
    
    let heroData = DEFAULT_CONTENT.hero;
    let contactInfoData = DEFAULT_CONTENT.contactInfo;
    let seoData = DEFAULT_CONTENT.seo;

    if (rows && rows.length > 0) {
      for (const row of rows) {
        if (row.section_type === "hero") {
          heroData = {
            subtitle: row.title || "",
            title: row.description || "",
            description: row.content || "",
          };
        } 
        else if (row.section_type === "contact-info") {
          try {
            if (row.content) {
              const parsed = JSON.parse(row.content);
              contactInfoData = {
                email: parsed.email || "",
                phone: parsed.phone || "",
                location: parsed.location || "",
              };
              console.log("[contact-content GET] contactInfo parsed:", contactInfoData);
            }
          } catch (e) {
            console.error("[contact-content GET] Parse error:", e);
          }
        } 
        else if (row.section_type === "seo") {
          seoData = {
            metaTitle: row.title || "",
            metaDescription: row.description || "",
          };
        }
      }
    }

    const result = {
      hero: heroData,
      contactInfo: contactInfoData,
      seo: seoData,
    };

    console.log("[contact-content GET] Response:", JSON.stringify(result));
    return NextResponse.json(result);
  } catch (error) {
    console.error("[contact-content GET] ERROR:", error);
    return NextResponse.json(DEFAULT_CONTENT);
  }
}

export async function POST(request: NextRequest) {
  try {
    const content: ContactPageContent = await request.json();
    console.log("[contact-content POST] Received content");

    await supabase
      .from("page_content")
      .delete()
      .eq("page_name", "contact");

    const rows: any[] = [];

    rows.push({
      page_name: "contact",
      section_type: "hero",
      title: content.hero.subtitle || "",
      description: content.hero.title || "",
      content: content.hero.description || "",
      section_order: 1,
    });

    if (content.contactInfo) {
      rows.push({
        page_name: "contact",
        section_type: "contact-info",
        title: "Contact Information",
        description: "",
        content: JSON.stringify({
          email: content.contactInfo.email || "",
          phone: content.contactInfo.phone || "",
          location: content.contactInfo.location || "",
        }),
        section_order: 2,
      });
    }

    if (content.seo) {
      rows.push({
        page_name: "contact",
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

    console.log("[contact-content POST] Success");
    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("[contact-content POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}
