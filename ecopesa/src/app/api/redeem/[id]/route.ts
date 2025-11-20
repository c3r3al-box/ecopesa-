import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params

  const supabase = await createClient();
  const { status, adminId } = await req.json();

  // 1. Fetch claim
  const { data: claim, error: claimError } = await supabase
    .from('reward_claims')
    .select('id, user_id, redeemed_points, status')
    .eq('id', id)
    .single();

  if (claimError || !claim) {
    return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
  }

  // 2. Deduct points if verified
  if (status === 'verified') {
    const { data: stats, error: statsError } = await supabase
      .from('recycling_stats')
      .select('eco_points')
      .eq('user_id', claim.user_id)
      .single();

    if (statsError || !stats) {
      return NextResponse.json({ error: 'User stats not found' }, { status: 404 });
    }

    if (stats.eco_points < claim.redeemed_points) {
      return NextResponse.json({ error: 'User does not have enough points' }, { status: 400 });
    }

    const newPoints = stats.eco_points - claim.redeemed_points;

    const { error: updateStatsError } = await supabase
      .from('recycling_stats')
      .update({ eco_points: newPoints, updated_at: new Date().toISOString() })
      .eq('user_id', claim.user_id);

    if (updateStatsError) {
      return NextResponse.json({ error: updateStatsError.message }, { status: 500 });
    }
  }

  // 3. Update claim status
  const { error: updateClaimError, data: updatedClaim } = await supabase
    .from('reward_claims')
    .update({
      status,
      verified_at: status === 'verified' ? new Date().toISOString() : null,
      verified_by: adminId,
    })
    .eq('id', id)
    .select()
    .single();

  if (updateClaimError) {
    return NextResponse.json({ error: updateClaimError.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      success: true,
      message: `Claim ${status}`,
      claim: updatedClaim,
    },
    { status: 200 }
  );
}
