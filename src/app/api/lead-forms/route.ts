import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const perkId = searchParams.get("perk_id");

    if (perkId) {
      const { data, error } = await supabase
        .from("lead_forms")
        .select("*")
        .eq("perk_id", perkId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return NextResponse.json(data || null);
    }

    const { data, error } = await supabase
      .from("lead_forms")
      .select("*");

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { perk_id, form_fields, submit_button_text, success_message } = body;

    if (!perk_id) {
      return NextResponse.json(
        { error: "Missing required field: perk_id" },
        { status: 400 }
      );
    }

    if (!form_fields || !Array.isArray(form_fields) || form_fields.length === 0) {
      return NextResponse.json(
        { error: "form_fields must be a non-empty array" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("lead_forms")
      .upsert({
        perk_id,
        form_fields,
        submit_button_text,
        success_message,
      }, { onConflict: "perk_id" })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, form_fields, submit_button_text, success_message } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("lead_forms")
      .update({
        form_fields,
        submit_button_text,
        success_message,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("lead_forms")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
