import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = createClient();

  const { data, error } = await (await supabase)
    .from('jobs')
    .select(`
      id,
      title,
      description,
      assigned_to ( id, full_name, role ),
      status,
      created_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ jobs: data }, { status: 200 });
}
