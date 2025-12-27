import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('perks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch perks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Only send fields that are guaranteed to exist in the schema
    const perkData: any = {
      name: body.name,
      description: body.description,
      category: body.category,
      discount: body.discount,
      expiry: body.expiry || null, // Convert empty string to null
      location: body.location || 'Global',
      image_url: body.image_url || null,
      logo_url: body.logo_url || null,
      deal_type: body.deal_type,
      best_for: body.best_for || null,
      status: body.status || 'Active',
    }
    
    // Handle deal_url - handle both null and empty string cases
    if (body.deal_url !== undefined) {
      if (body.deal_url === null || body.deal_url === "" || body.deal_url?.trim?.() === "") {
        perkData.deal_url = null
      } else {
        perkData.deal_url = body.deal_url
      }
    }
    
    const { data, error } = await supabase
      .from('perks')
      .insert([perkData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('API error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create perk' }, { status: 500 })
  }
}
