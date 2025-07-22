// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const formData = await request.formData();

  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
      }
    }
  };

  const { data, error } = await supabase.auth.signUp(credentials);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    requiresConfirmation: !data.session,
    redirectTo: data.session ? formData.get('callbackUrl') as string : null
  });
}