import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ pageName: string }> }
) {
  try {
    const { pageName } = await params
    
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_name', pageName)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch page content' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ pageName: string }> }
) {
  try {
    const { pageName } = await params
    const body = await request.json()
    
    const { data: existing, error: fetchError } = await supabase
      .from('page_content')
      .select('id')
      .eq('page_name', pageName)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    if (existing) {
      const { data, error } = await supabase
        .from('page_content')
        .update(body)
        .eq('page_name', pageName)
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json(data)
    } else {
      const { data, error } = await supabase
        .from('page_content')
        .insert([{ page_name: pageName, ...body }])
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json(data)
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update page content' }, { status: 500 })
  }
}
