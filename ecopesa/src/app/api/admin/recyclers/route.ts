import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { userId, assignedCentreId, staffPin } = body;

  if (!userId || !assignedCentreId || !staffPin) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Step 1: Update role in profiles
  const { error: roleError } = await supabase
    .from('profiles')
    .update({ role: 'recycler' })
    .eq('id', userId);

  if (roleError) {
    return NextResponse.json({ error: roleError.message }, { status: 500 });
  }

  // Step 2: Create recycler record
  const { error: insertError } = await supabase
    .from('recyclers')
    .insert([
      {
        user_id: userId,
        assigned_centre_id: assignedCentreId,
        staff_pin: staffPin,
      },
    ]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
