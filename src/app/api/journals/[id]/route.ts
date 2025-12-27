import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to fetch by ID first, then by slug
    let query = supabase
      .from("journals")
      .select("*");

    // Check if it looks like a UUID (36 chars with hyphens) or a slug
    if (id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      query = query.eq("id", id);
    } else {
      query = query.eq("slug", id);
    }

    const { data, error } = await query.single();

    if (error && error.code !== "PGRST116") throw error;
    if (!data)
      return NextResponse.json(
        { error: "Journal not found" },
        { status: 404 }
      );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET /api/journals/[id] error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Check if it looks like a UUID or a slug
    const whereClause = id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      ? { id }
      : { slug: id };

    const { data, error } = await supabase
      .from("journals")
      .update(body)
      .match(whereClause)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("PUT /api/journals/[id] error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if it looks like a UUID or a slug
    const whereClause = id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      ? { id }
      : { slug: id };

    const { error } = await supabase
      .from("journals")
      .delete()
      .match(whereClause);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/journals/[id] error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
