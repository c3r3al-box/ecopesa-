import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, props: { params: Promise<{ action: string }> }) {
  const params = await props.params;
  const supabase = createRouteHandlerClient({ cookies });
  const { jobId, reason } = await req.json();
  const { action } = params;

  if (!jobId || typeof jobId !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid jobId' }, { status: 400 });
  }

  let rpcName: string;
  let rpcArgs: Record<string, any>;

  switch (action) {
    case 'accept':
      rpcName = 'accept_job';
      rpcArgs = { p_job_id: jobId };
      break;

    case 'reject':
      rpcName = 'reject_job';
      rpcArgs = { p_job_id: jobId, p_reason: reason ?? null };
      break;

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const { error } = await supabase.rpc(rpcName, rpcArgs);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
