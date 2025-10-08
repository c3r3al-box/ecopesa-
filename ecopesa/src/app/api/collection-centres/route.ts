import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies(); // AWAIT this now

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = (await cookies()).get(name); // AWAIT here too
          return cookie ? cookie.value : undefined;
        },
        async set(name: string, value: string, options: any) {
          try {
            (await cookies()).set({ name, value, ...options });
          } catch (error) {
            // Server Component error for cookie setting
          }
        },
        async remove(name: string, options: any) {
          try {
            (await cookies()).set({ name, value: '', ...options, maxAge: 0 });
          } catch (error) {
            // Server Component error for cookie removal
          }
        },
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Debug: Check available cookies
    const cookieStore = await cookies(); // AWAIT here
    const allCookies = cookieStore.getAll();
    console.log('Available cookies:', allCookies.map(c => c.name));

    // Try to get the session first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session:', session);
    console.log('Session error:', sessionError);

    // Then get user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('User:', user);
    console.log('Auth error:', authError);

    if (!user || authError) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session' }, 
        { status: 401 }
      );
    }

    const body = await req.json();

    const { data, error } = await supabase
      .from('collection_centres')
      .insert([body])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Insert successful', data }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message }, 
      { status: 500 }
    );
  }
}