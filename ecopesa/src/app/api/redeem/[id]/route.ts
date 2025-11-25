import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import axios from 'axios';

async function getMpesaToken() {
  const auth = Buffer.from(
    process.env.MPESA_CONSUMER_KEY + ':' + process.env.MPESA_CONSUMER_SECRET
  ).toString('base64');

  const res = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return res.data.access_token;
}

async function sendMpesaPayment(mpesaNumber: string, amount: number, claimId: string) {
  const token = await getMpesaToken();

  const res = await axios.post(
    'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
    {
      InitiatorName: process.env.MPESA_INITIATOR,
      SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
      CommandID: 'BusinessPayment',
      Amount: amount,
      PartyA: process.env.MPESA_SHORTCODE,
      PartyB: mpesaNumber,
      Remarks: 'EcoPesa reward payout',
      QueueTimeOutURL: process.env.MPESA_TIMEOUT_URL,
      ResultURL: process.env.MPESA_RESULT_URL,
      Occasion: 'EcoPesa',
      OriginatorConversationID: claimId,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const supabase = await createClient();
  const { status, adminId, reason } = await req.json();
  const { id: claimId } = context.params;

  if (!status || !adminId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // 1. Fetch claim
  const { data: claim, error: claimError } = await supabase
    .from('reward_claims')
    .select('*')
    .eq('id', claimId)
    .single();

  if (claimError || !claim) {
    return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
  }

  if (status === 'verified') {
    // 2a. Update claim status
    await supabase
      .from('reward_claims')
      .update({
        status: 'verified',
        verified_by: adminId,
        verified_at: new Date().toISOString(),
      })
      .eq('id', claimId);

    // 2b. Trigger M-Pesa payout
    try {
      const payout = await sendMpesaPayment(claim.mpesa_number, claim.cash_value, claimId);
      const transactionId = payout?.ConversationID || null;

      await supabase
        .from('reward_claims')
        .update({
          payout_status: 'initiated',
          transaction_id: transactionId,
        })
        .eq('id', claimId);

      return NextResponse.json({
        success: true,
        message: 'Claim approved. Cash sent via M-Pesa.',
        transactionId,
      });
    } catch (err: any) {
      await supabase
        .from('reward_claims')
        .update({ payout_status: 'failed' })
        .eq('id', claimId);

      console.error('M-Pesa error:', err.response?.data || err.message);

      return NextResponse.json({
        success: false,
        error: 'Claim approved but M-Pesa payout failed',
        details: err.message,
      }, { status: 500 });
    }
  }

  if (status === 'rejected') {
    await supabase
      .from('reward_claims')
      .update({
        status: 'rejected',
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        rejection_reason: reason || 'No reason provided',
      })
      .eq('id', claimId);

    return NextResponse.json({
      success: false,
      message: 'Claim rejected.',
      reason,
    });
  }

  return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
}
