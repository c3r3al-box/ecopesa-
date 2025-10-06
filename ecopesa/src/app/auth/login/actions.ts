'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }



 const { error, data: authData } = await supabase.auth.signInWithPassword(data);
 
if (error || !authData?.user || !authData.session) {
  console.log('Login failed:', error);
  return redirect('/error');
}

await supabase.auth.setSession(authData.session);

const {data: fullUser, error: userFetchError } = await supabase.auth.getUser();

if (userFetchError || !fullUser?.user) {
  console.log("User fetch failed:", userFetchError);
}
const user = fullUser?.user;

// Check if profile exists
const { data: profileCheck, error: profileCheckError } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', authData.user.id)
  .single();

if (profileCheckError && profileCheckError.code !== 'PGRST116') {
  console.log('Profile fetch failed:', profileCheckError);
  return redirect('/error');
}

// Insert if missing

if (!profileCheck) {
  const user = authData.user;

  // Better fallback values
  const insertData = {
    id: user.id,
    email: user.email ?? user.user_metadata?.email ?? '',
    full_name: user.user_metadata?.full_name ?? 
               user.user_metadata?.name ?? 
               user.email?.split('@')[0] ?? // fallback to username part of email
               'User',
    role: user.user_metadata?.role || 'USER',
  };

  console.log('Insert payload:', insertData);

  const { error: insertError } = await supabase.from('profiles').insert(insertData);

  if (insertError) {
    console.log('Profile insert failed:', insertError);
    return redirect('/error');
  }
}

// Fetch profile again
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', authData.user.id)
  .single();

if (profileError || !profile?.role) {
  console.log('Profile fetch failed:', profileError);
  return redirect('/error');
}

// Redirect based on role
if (!profile || !profile.role) {
  console.log('Profile is null or missing role');
  return redirect('/error');
}



// 🚦 Redirect based on role
switch (profile.role.toUpperCase()) {
  case 'ADMIN':
    revalidatePath('/dashboard/admin');
    return redirect('/dashboard/admin');
  case 'RECYCLER':
    revalidatePath('/dashboard/recycler');
    return redirect('/dashboard/recycler');
  case 'COLLECTOR':
    revalidatePath('/dashboard/collector');
    return redirect('/dashboard/collector');
  case 'USER':
    revalidatePath('/dashboard/user');
    return redirect('/dashboard/user');
  default:
    return redirect('/');
}

}
