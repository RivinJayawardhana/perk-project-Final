import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subcategoryId: string }> }
) {
  try {
    const { subcategoryId } = await params

    const { data, error } = await supabase
      .from('subcategories')
      .select(`
        id,
        name,
        slug,
        category_id,
        created_at,
        categories(id, name, slug)
      `)
      .eq('id', subcategoryId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch subcategory' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ subcategoryId: string }> }
) {
  try {
    const { subcategoryId } = await params
    const body = await request.json()
    const { name, category_id, slug } = body

    // Generate slug from name if not provided
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

    const { data, error } = await supabase
      .from('subcategories')
      .update({ name, category_id, slug: finalSlug })
      .eq('id', subcategoryId)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update subcategory' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ subcategoryId: string }> }
) {
  try {
    const { subcategoryId } = await params

    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', subcategoryId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete subcategory' }, { status: 500 })
  }
}
