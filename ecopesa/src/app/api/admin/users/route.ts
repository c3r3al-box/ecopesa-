import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { userId, role } = body;

  if (!userId || !role) {
    return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
  }

  // Normalize role casing
  const normalizedRole = role.toUpperCase();

  // ✅ Only update the role in profiles
  const { data: updatedProfile, error: roleError } = await supabase
    .from('profiles')
    .update({ role: normalizedRole })
    .eq('id', userId)
    .select()
    .maybeSingle();

  console.log('Updating role for userId:', userId);
  

  if (roleError) {
    return NextResponse.json({ error: roleError.message }, { status: 500 });
  }

  if (!updatedProfile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, updatedProfile });
}
