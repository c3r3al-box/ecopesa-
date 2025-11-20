import { NextResponse } from 'next/server';
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
