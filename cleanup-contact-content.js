#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://rdkohvwljwbncximfpmq.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJka29odndsandibmN4aW1mcG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM5ODg2OCwiZXhwIjoyMDc0OTc0ODY4fQ.-ZYQ6ZrQjBDDbjoOGY587dBK0shR0hgCqUv97FLgPqw";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupContactContent() {
  try {
    console.log("🧹 Starting cleanup of contact page content...\n");

    // Fetch current contact content
    const { data: rows, error: fetchError } = await supabase
      .from("page_content")
      .select("*")
      .eq("page_name", "contact");

    if (fetchError) {
      console.error("❌ Error fetching data:", fetchError);
      process.exit(1);
    }

    console.log(`📊 Found ${rows?.length || 0} rows for contact page\n`);

    if (!rows || rows.length === 0) {
      console.log("✅ No test data found. Database is clean!");
      process.exit(0);
    }

    // Display current data
    console.log("Current data in database:");
    rows.forEach((row, i) => {
      console.log(`\n[${i + 1}] ${row.section_type}:`);
      console.log(`   Title: ${row.title}`);
      console.log(`   Description: ${row.description}`);
      console.log(`   Content: ${row.content}`);
    });

    console.log("\n\n🔄 Replacing with clean data...\n");

    // Delete existing content
    const { error: deleteError } = await supabase
      .from("page_content")
      .delete()
      .eq("page_name", "contact");

    if (deleteError) {
      console.error("❌ Error deleting data:", deleteError);
      process.exit(1);
    }

    // Insert clean content
    const cleanContent = [
      {
        page_name: "contact",
        section_type: "hero",
        title: "Contact us",
        description: "We'd love to hear from you",
        content: "Whether you have a question about perks, partnerships, or anything else—our team is ready to help.",
        section_order: 1,
      },
      {
        page_name: "contact",
        section_type: "contact-info",
        title: "Contact Information",
        description: "",
        content: JSON.stringify({
          email: "support@venturenext.io",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
        }),
        section_order: 2,
      },
      {
        page_name: "contact",
        section_type: "seo",
        title: "Contact VentureNext - Get in Touch",
        description: "Have questions about VentureNext? Contact our team and we'll be happy to help with any inquiries.",
        content: "",
        section_order: 0,
      },
    ];

    const { error: insertError } = await supabase
      .from("page_content")
      .insert(cleanContent);

    if (insertError) {
      console.error("❌ Error inserting clean data:", insertError);
      process.exit(1);
    }

    console.log("✅ Successfully inserted clean content:");
    console.log("\n📋 New contact content:");
    console.log(`   Hero Title: "${cleanContent[0].description}"`);
    console.log(`   Hero Description: "${cleanContent[0].content}"`);
    console.log(`   Email: "support@venturenext.io"`);
    console.log(`   Phone: "+1 (555) 123-4567"`);
    console.log(`   Location: "San Francisco, CA"`);
    console.log(`   Meta Title: "Contact VentureNext - Get in Touch"`);
    console.log(`   Meta Description: "Have questions about VentureNext? Contact our team and we'll be happy to help with any inquiries."`);

    console.log("\n✨ Cleanup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

cleanupContactContent();
