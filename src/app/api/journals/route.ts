import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "published";
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("journals")
      .select("*")
      .eq("status", status)
      .order("publish_date", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET /api/journals error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image_url,
      author,
      category,
      tags,
      status,
      publish_date,
      meta_title,
      meta_description,
      keywords,
      og_image_url,
      canonical_url,
      read_time,
      is_featured,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, content" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("journals")
      .insert({
        title,
        slug,
        excerpt,
        content,
        featured_image_url,
        author,
        category,
        tags,
        status,
        publish_date,
        meta_title,
        meta_description,
        keywords,
        og_image_url,
        canonical_url,
        read_time,
        is_featured,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/journals error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
