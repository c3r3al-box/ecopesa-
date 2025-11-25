import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { userId, mpesaNumber, redeemedPoints } = await req.json();

  const { data: stats, error: statsError } = await supabase
    .from('recycling_stats')
    .select('eco_points')
    .eq('user_id', userId)
    .single();

  if (statsError || !stats) {
    return NextResponse.json({ error: 'User stats not found' }, { status: 404 });
  }

  if (stats.eco_points < redeemedPoints) {
    return NextResponse.json({ error: 'Not enough points to redeem' }, { status: 400 });
  }

  const cashValue = redeemedPoints * 1;
  const currentPoints = stats.eco_points;

  if (redeemedPoints > currentPoints) {
    return NextResponse.json({ error: 'Insufficient eco points' }, { status: 400 });
  }

  const newBalance = currentPoints - redeemedPoints;

  await supabase
  .from ('recycling_stats')
  .update({ eco_points: newBalance })
  .eq('user_id', userId);



  const { data: claim, error: claimError } = await supabase
    .from('reward_claims')
    .insert({
      user_id: userId,
      mpesa_number: mpesaNumber,
      redeemed_points: redeemedPoints,
      cash_value: cashValue,
      status: 'pending',
    })
    .select()
    .single();

  if (claimError) {
    return NextResponse.json({ error: claimError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, claim }, { status: 200 });
}



export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'pending';

  const { data, error } = await supabase
    .from('reward_claims')
    .select(`
      id,
      mpesa_number,
      redeemed_points,
      cash_value,
      status,
      created_at,
      verified_by:profiles!reward_claims_verified_by_fkey (id, full_name),
      user_id:profiles!fk_reward_claims_user (id, full_name, role)
    `)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching claims:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ claims: data }, { status: 200 });
}


