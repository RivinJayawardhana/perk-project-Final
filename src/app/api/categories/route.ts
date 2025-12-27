import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug, created_at')
      .order('name')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Get subcategory counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat: any) => {
        const { count, error: countError } = await supabase
          .from('subcategories')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', cat.id)

        return {
          ...cat,
          subcategories_count: count || 0
        }
      })
    )

    return NextResponse.json(categoriesWithCounts)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug } = body

    // Generate slug from name if not provided
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug: finalSlug }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
