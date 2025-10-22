import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role,');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { userId, role, staffPin, assignedCentreId } = body;

  if (!userId || !role) {
    return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
  }

  // Step 1: Update role in profiles
  const { error: roleError } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (roleError) {
    return NextResponse.json({ error: roleError.message }, { status: 500 });
  }

  // Step 2: Insert into role-specific table
  if (role === 'RECYCLER') {
    if (!staffPin || !assignedCentreId) {
      return NextResponse.json({ error: 'Missing staffPin or assignedCentreId for recycler' }, { status: 400 });
    }

    const { error: insertError } = await supabase
      .from('recyclers')
      .upsert({
        user_id: userId,
        staff_pin: staffPin,
        assigned_centre_id: assignedCentreId,
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  if (role === 'COLLECTOR') {
    // Add collector-specific logic here if needed
  }

  return NextResponse.json({ success: true });
}
