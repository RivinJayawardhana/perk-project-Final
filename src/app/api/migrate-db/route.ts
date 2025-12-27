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
    // Check if is_featured column exists by trying to select it
    const { data: testData, error: testError } = await supabase
      .from("journals")
      .select("is_featured")
      .limit(1);

    // If we get an error about is_featured column not existing, tell user to run migration
    if (testError && testError.message && testError.message.includes("is_featured")) {
      console.log("Column is_featured doesn't exist in journals table");
      return NextResponse.json(
        {
          error: "Column doesn't exist in database",
          instructions:
            "Please run this SQL in your Supabase SQL Editor: ALTER TABLE journals ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;",
        },
        { status: 400 }
      );
    }

    if (testError) {
      console.error("Unexpected error:", testError);
      return NextResponse.json(
        {
          error: testError.message || "Unknown error",
          instructions:
            "Please run this SQL in your Supabase SQL Editor: ALTER TABLE journals ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;",
        },
        { status: 500 }
      );
    }

    // Column exists!
    return NextResponse.json({
      success: true,
      message: "Database is ready with is_featured column",
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Migration failed",
        instructions:
          "Please run this SQL in your Supabase SQL Editor: ALTER TABLE journals ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;",
      },
      { status: 500 }
    );
  }
}
