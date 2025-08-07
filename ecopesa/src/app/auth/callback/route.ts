// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Fetch role from profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (error || !profile?.role) {
    // Fallback if role is missing or query fails
    redirect('/dashboard/user');
  }

  // Redirect based on role
  switch (profile.role) {
    case 'admin':
      redirect('/dashboard/admin');
    case 'collector':
      redirect('/dashboard/collector');
    case "recycler":
      redirect('/dashboard/recycler');
    default:
      redirect('/dashboard/user');
  }
}
