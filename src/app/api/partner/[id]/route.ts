import { supabase } from '@/lib/supabase'
import { NextResponse, NextRequest } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('partner_applications')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Partner application deleted successfully' })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }
}
