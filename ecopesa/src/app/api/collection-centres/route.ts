import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers';

function getSupabaseClient() {
    return createRouteHandlerClient({ cookies });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
}

//there is an issue with supabase ssr and cookies, here youve used asynchronous cookies tho its is depracated but sync causes errors so stick w this.