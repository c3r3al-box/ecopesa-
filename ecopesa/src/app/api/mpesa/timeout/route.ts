import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  console.log('M-Pesa Timeout Callback:', body);

  const claimId = body?.Result?.OriginatorConversationID;

  if (claimId) {
    await supabase
      .from('reward_claims')
      .update({ payout_status: 'timeout' })
      .eq('id', claimId);
  }

  return NextResponse.json({ message: 'Timeout received' });
}
