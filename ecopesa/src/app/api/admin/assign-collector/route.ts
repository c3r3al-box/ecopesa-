import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('role', 'COLLECTOR');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ collectors: data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { collector_id, centre_id } = body;

  if (!collector_id || !centre_id) {
    return NextResponse.json({ error: 'Missing collector or centre ID' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert([{
      job_type: 'Pickup',
      description: 'Assigned to collection centre',
      assigned_to: collector_id,
      collection_centre_id: centre_id,
      status: 'active'
    }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Collector assigned via job', data }, { status: 201 });
}
