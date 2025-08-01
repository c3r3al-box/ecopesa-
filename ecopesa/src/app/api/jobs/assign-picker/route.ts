import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { jobId, pickerId } = await req.json();

  const { error } = await supabase
    .from('jobs')
    .update({ picker_id: pickerId, status: 'assigned_to_picker' })
    .eq('id', jobId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
