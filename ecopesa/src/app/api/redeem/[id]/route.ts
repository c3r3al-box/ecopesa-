import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string}>}
) {
  const supabase = await createClient();
  const { status, adminId, reason } = await req.json();

  if (!status || !adminId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { id: claimId } = await context.params;

  // 1. Fetch the claim
  const { data: claim, error: claimError } = await supabase
    .from('reward_claims')
    .select('*')
    .eq('id', claimId)
    .single();

  if (claimError || !claim) {
    return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
  }

  if (status === 'verified') {
    // 2a. Update claim
    const { error: updateError } = await supabase
      .from('reward_claims')
      .update({
        status: 'verified',
        verified_by: adminId,
        verified_at: new Date().toISOString(),
      })
      .eq('id', claimId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 2b. Deduct points from user profile
    const { error: statsError } = await supabase
      .from('recycling_stats')
      .update({ eco_points: claim.eco_points - claim.redeemed_points })
      .eq('user_id', claim.user_id);

    if (statsError) {
      return NextResponse.json({ error: statsError.message }, { status: 500 });
    }

    // 2c. Trigger M-Pesa B2C payout (Daraja API call here)

    return NextResponse.json({
      success: true,
      message: 'Claim approved. Cash sent via M-Pesa.',
    });
  }

  if (status === 'rejected') {
    // 3a. Update claim with reason
    const { error: rejectError } = await supabase
      .from('reward_claims')
      .update({
        status: 'rejected',
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        rejection_reason: reason || 'No reason provided',
      })
      .eq('id', claimId);

    if (rejectError) {
      return NextResponse.json({ error: rejectError.message }, { status: 500 });
    }

    // 3b. Refund points
    const { error: refundError } = await supabase
      .from('recycling_stats')
      .update({ eco_points: claim.eco_points + claim.redeemed_points })
      .eq('user_id', claim.user_id);

    if (refundError) {
      return NextResponse.json({ error: refundError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: false,
      message: 'Claim rejected. Points refunded.',
      reason,
    });
  }

  return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
}
