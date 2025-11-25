import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { full_name, role, password } = await req.json();

  const { error } = await supabase.auth.updateUser({
    password: password || undefined,
    data: {
      full_name: full_name || undefined,
      role: role || undefined,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
