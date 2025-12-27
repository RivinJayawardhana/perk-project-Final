import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: NextRequest) {
  try {
    // Check if contact-info already exists
    const { data: existing } = await supabase
      .from("page_content")
      .select("id")
      .eq("page_name", "contact")
      .eq("section_type", "contact-info")
      .single();

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: "Contact info already exists" 
      });
    }

    // Insert default contact info
    const { error } = await supabase
      .from("page_content")
      .insert({
        page_name: "contact",
        section_type: "contact-info",
        title: "Contact Information",
        description: "",
        content: JSON.stringify({
          email: "support@venturenext.co",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
        }),
        section_order: 2,
      });

    if (error) throw error;

    console.log("[seed-contact-info] Successfully seeded contact info");
    return NextResponse.json({ 
      success: true, 
      message: "Contact info seeded successfully" 
    });
  } catch (error) {
    console.error("[seed-contact-info] Error:", error);
    return NextResponse.json(
      { error: "Failed to seed contact info" },
      { status: 500 }
    );
  }
}
