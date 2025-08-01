// app/api/collector/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(_req: NextRequest) {
  // Initialize server-side Supabase, reading the auth cookie
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  // Fetch pending pickup requests
  const { data: pickupRequests, error: prErr } = await supabase
    .from('pickup_requests')
    .select('*')
    .eq('status', 'pending');

  // Fetch jobs assigned to this collector
  const { data: assignedJobs, error: ajErr } = await supabase
    .from('jobs')
    .select('*')
    .eq('job_type', 'collector')
    .eq('assigned_to', userId);

  if (prErr || ajErr) {
    const message = prErr?.message || ajErr?.message || 'Unknown error';
    console.error('API fetch error:', prErr, ajErr);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ pickupRequests, assignedJobs });
}
