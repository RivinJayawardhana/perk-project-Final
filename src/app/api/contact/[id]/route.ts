import { supabase } from '@/lib/supabase'
import { NextResponse, NextRequest } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Contact submission deleted successfully' })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 })
  }
}
