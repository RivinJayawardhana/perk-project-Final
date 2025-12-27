import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error("Error listing buckets:", listError);
      return NextResponse.json(
        { error: "Failed to list buckets" },
        { status: 500 }
      );
    }

    const bucketExists = buckets?.some((b) => b.name === "journal-images");

    if (!bucketExists) {
      // Create the bucket
      const { data, error: createError } = await supabase.storage.createBucket(
        "journal-images",
        {
          public: true,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
          fileSizeLimit: 5242880, // 5MB
        }
      );

      if (createError) {
        console.error("Error creating bucket:", createError);
        return NextResponse.json(
          { error: "Failed to create storage bucket", details: createError.message },
          { status: 500 }
        );
      }

      console.log("Created journal-images bucket");
    }

    return NextResponse.json({ success: true, message: "Bucket is ready" });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Setup failed" },
      { status: 500 }
    );
  }
}
