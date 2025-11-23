import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { profile } from 'console';

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

  // Fetch profile email
const { data: profile } = await supabase
  .from('profiles')
  .select('email')
  .eq('id', userId)
  .single();

// Fetch centre name
const { data: centre } = await supabase
  .from('collection_centres')
  .select('name')
  .eq('id', assignedCentreId)
  .single();

  const { error: insertError } = await supabase
    .from('recyclers')
    .insert([
      {
        user_id: userId,
        email: profile?.email,
        assigned_centre_name: centre?.name, 
        assigned_centre_id: assignedCentreId,
        staff_pin: staffPin,
      },
    ]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('recyclers')
    .select('id, email, staff_pin, assigned_centre_name, assigned_centre_id');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
