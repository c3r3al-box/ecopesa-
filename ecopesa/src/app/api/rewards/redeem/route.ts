import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { userId, amount, phone } = body;

  if (!userId || !amount || !phone) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Simulate M-Pesa payout
  const { error } = await supabase
    .from('reward_redemptions')
    .insert([
      {
        user_id: userId,
        amount,
        phone,
        status: 'simulated',
        timestamp: new Date().toISOString(),
      },
    ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `Simulated M-Pesa payout to ${phone}`,
  });
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
      user_id:profiles!reward_claims_user_id_fkey (id, full_name, role)
    `)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching claims:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ claims: data }, { status: 200 });
}
