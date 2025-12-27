#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://rdkohvwljwbncximfpmq.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJka29odndsandibmN4aW1mcG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM5ODg2OCwiZXhwIjoyMDc0OTc0ODY4fQ.-ZYQ6ZrQjBDDbjoOGY587dBK0shR0hgCqUv97FLgPqw";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function restoreContactContent() {
  try {
    console.log("🔄 Restoring contact page content...\n");

    // Delete current content
    const { error: deleteError } = await supabase
      .from("page_content")
      .delete()
      .eq("page_name", "contact");

    if (deleteError) {
      console.error("❌ Error deleting data:", deleteError);
      process.exit(1);
    }

    // Insert original test data
    const originalContent = [
      {
        page_name: "contact",
        section_type: "hero",
        title: "Get In Touch ...... sss",
        description: "Talk To Us....kkkk",
        content: "Questions, suggestions, partnership inquiries, or anything else, we're all ears! We'll get back to you within 24 hours!...sss",
        section_order: 1,
      },
      {
        page_name: "contact",
        section_type: "contact-info",
        title: "Contact Information",
        description: "",
        content: JSON.stringify({
          email: "support@venturenext.com.. sds sd",
          phone: "+1 (555) 123-4567....sds dssss",
          location: "San Francisco, CA",
        }),
        section_order: 2,
      },
      {
        page_name: "contact",
        section_type: "seo",
        title: "Contact VentureNext - Get in Touch ... test",
        description: "Have questions about VentureNext? Contact our team and we'll be happy to help with any inquiries.",
        content: "",
        section_order: 0,
      },
    ];

    const { error: insertError } = await supabase
      .from("page_content")
      .insert(originalContent);

    if (insertError) {
      console.error("❌ Error restoring data:", insertError);
      process.exit(1);
    }

    console.log("✅ Successfully restored original data!");
    console.log("\n📋 Restored content:");
    console.log(`   Hero Title: "Talk To Us....kkkk"`);
    console.log(`   Hero Subtitle: "Get In Touch ...... sss"`);
    console.log(`   Email: "support@venturenext.com.. sds sd"`);
    console.log(`   Phone: "+1 (555) 123-4567....sds dssss"`);
    console.log(`   Meta Title: "Contact VentureNext - Get in Touch ... test"`);

    console.log("\n✨ Data restored successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

restoreContactContent();
