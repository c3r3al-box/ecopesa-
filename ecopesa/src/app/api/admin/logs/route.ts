import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('recycling_logs')
    .select(`
      id,
      recycled_weight,
      points_earned,
      material_type,
      created_at,
      verified_by ( id, full_name ),
      user_id ( id, full_name, role )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ logs: data }, { status: 200 });
}
