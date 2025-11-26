import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function DELETE(req: Request) {
  try {
    // 🔑 Extract the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: no token provided' }, { status: 401 });
    }

    // ✅ Create a client scoped to this user’s token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
      }
    );

    // ✅ Get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized: invalid token' }, { status: 401 });
    }

    // ✅ Delete from your profiles table
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    // ✅ Delete from Supabase Auth using service role key
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ must be set in server env, never exposed to client
    );

    const { error: adminError } = await adminClient.auth.admin.deleteUser(user.id);
    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
