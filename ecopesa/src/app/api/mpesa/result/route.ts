import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  console.log('M-Pesa Result Callback:', body);

  const result = body?.Result;
  const claimId = result?.OriginatorConversationID; // we set this in the payout request
  const transactionId = result?.TransactionID || null;
  const resultCode = result?.ResultCode;

  if (claimId) {
    let payoutStatus = 'failed';
    if (resultCode === 0) payoutStatus = 'success';

    await supabase
      .from('reward_claims')
      .update({
        payout_status: payoutStatus,
        transaction_id: transactionId,
      })
      .eq('id', claimId);
  }

  return NextResponse.json({ message: 'Result received' });
}
