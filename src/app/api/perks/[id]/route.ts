import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { data, error } = await supabase
      .from('perks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch perk' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Build update data with known safe fields
    const updateData: any = {}
    
    const safeFields = ['name', 'description', 'category', 'discount', 'location', 'image_url', 'logo_url', 'deal_type', 'deal_url', 'best_for', 'status']
    
    safeFields.forEach(field => {
      if (body[field] !== undefined && body[field] !== null) {
        updateData[field] = body[field]
      }
    })
    
    // Handle expiry - convert empty string to null
    if (body.expiry !== undefined) {
      updateData.expiry = body.expiry || null
    }
    
    // Handle deal_url - handle both null and empty string cases
    if (body.deal_url !== undefined) {
      if (body.deal_url === null || body.deal_url === "" || body.deal_url?.trim?.() === "") {
        updateData.deal_url = null
      } else {
        updateData.deal_url = body.deal_url
      }
    }
    
    const { data, error } = await supabase
      .from('perks')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('API error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update perk' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { error } = await supabase
      .from('perks')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete perk' }, { status: 500 })
  }
}
