import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface FooterData {
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  footerLinks: Array<{
    section: string;
    links: Array<{
      label: string;
      url: string;
    }>;
  }>;
  copyrightText?: string;
  newsletter?: {
    title: string;
    subtitle: string;
  };
  metadata?: {
    copyrightText?: string;
  };
}

const DEFAULT_DATA: FooterData = {
  socialLinks: [
    { platform: "Facebook", url: "#", icon: "Facebook" },
    { platform: "Instagram", url: "#", icon: "Instagram" },
    { platform: "LinkedIn", url: "#", icon: "Linkedin" },
  ],
  footerLinks: [
    {
      section: "Product",
      links: [
        { label: "Explore Perks", url: "/perks" },
        { label: "For Teams", url: "/perks" },
      ],
    },
    {
      section: "Company",
      links: [
        { label: "About Us", url: "/about" },
        { label: "Journal", url: "/journal" },
        { label: "Contact", url: "/contact" },
      ],
    },
    {
      section: "Partners",
      links: [
        { label: "Become a Partner", url: "/partner" },
        { label: "Partner Login", url: "/partner" },
      ],
    },
    {
      section: "Legal",
      links: [
        { label: "Privacy Policy", url: "#" },
        { label: "Terms of Service", url: "#" },
      ],
    },
  ],
  copyrightText: "© 2025 VentureNext. All rights reserved.",
  newsletter: {
    title: "Never Miss a Gift Moment",
    subtitle: "Get exclusive offers, new experience alerts, and gifting inspiration delivered to your inbox.",
  },
};

export async function GET() {
  try {
    console.log("=== FOOTER FETCH START ===");
    
    // Get the latest footer content row (should be only one)
    const { data, error } = await supabase
      .from("footer_content")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    console.log("GET response:", { error, rowCount: data?.length });

    if (error) {
      console.error("GET error:", error);
      return NextResponse.json(DEFAULT_DATA);
    }

    if (!data || data.length === 0) {
      console.log("No footer content found in DB, returning defaults");
      return NextResponse.json(DEFAULT_DATA);
    }

    const row = data[0];
    console.log("Found footer row:", {
      id: row.id,
      hasSocialLinks: !!row.social_links,
      hasFooterLinks: !!row.footer_links,
    });

    // Check if data exists and has content
    const socialLinks = row.social_links && Array.isArray(row.social_links) && row.social_links.length > 0
      ? row.social_links
      : DEFAULT_DATA.socialLinks;
      
    const footerLinks = row.footer_links && Array.isArray(row.footer_links) && row.footer_links.length > 0
      ? row.footer_links
      : DEFAULT_DATA.footerLinks;

    // Try to get copyright text from metadata column or fallback to default
    const metadata = row.metadata && typeof row.metadata === 'object' ? row.metadata : {};
    const copyrightText = metadata.copyrightText || row.copyright_text || DEFAULT_DATA.copyrightText;
    
    // Get newsletter data from metadata or fallback to default
    const newsletter = metadata.newsletter || row.newsletter || DEFAULT_DATA.newsletter;

    const footerData: FooterData = {
      socialLinks,
      footerLinks,
      copyrightText,
      newsletter,
      metadata: {
        copyrightText,
      },
    };

    console.log("Returning footer data with", socialLinks.length, "social links and", footerLinks.length, "footer sections");
    console.log("=== FOOTER FETCH SUCCESS ===");
    return NextResponse.json(footerData);
  } catch (error) {
    console.error("GET /api/footer-content error:", error);
    return NextResponse.json(DEFAULT_DATA);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: FooterData = await request.json();
    console.log("=== FOOTER SAVE START ===");
    console.log("Received footer data:", JSON.stringify(data, null, 2));

    // Get all existing rows
    const { data: existingData, error: fetchError, count } = await supabase
      .from("footer_content")
      .select("id", { count: "exact" });

    console.log("Existing data check:", { count, fetchError });

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { error: fetchError.message || "Failed to fetch existing data" },
        { status: 500 }
      );
    }

    if (existingData && existingData.length > 0) {
      console.log("Found existing rows:", existingData.length, "- Deleting all and inserting fresh");
      
      // Delete all existing rows
      const { error: deleteError } = await supabase
        .from("footer_content")
        .delete()
        .not("id", "is", null);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        return NextResponse.json(
          { error: `Delete failed: ${deleteError.message}` },
          { status: 500 }
        );
      }

      console.log("Successfully deleted all old rows");
    }

    // Insert fresh new row
    console.log("Inserting new footer content row");
    const { data: insertData, error: insertError } = await supabase
      .from("footer_content")
      .insert({
        social_links: data.socialLinks,
        footer_links: data.footerLinks,
        metadata: {
          copyrightText: data.copyrightText,
          newsletter: data.newsletter,
        },
      })
      .select();

    console.log("Insert response:", { insertData, insertError });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: `Insert failed: ${insertError.message}` },
        { status: 500 }
      );
    }

    if (!insertData || insertData.length === 0) {
      console.error("Insert returned no rows");
      return NextResponse.json(
        { error: "Insert failed: No rows were inserted" },
        { status: 500 }
      );
    }

    console.log("Successfully inserted fresh footer content:", insertData[0]);
    console.log("=== FOOTER SAVE SUCCESS ===");
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("=== FOOTER SAVE ERROR ===", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save footer data" },
      { status: 500 }
    );
  }
}
