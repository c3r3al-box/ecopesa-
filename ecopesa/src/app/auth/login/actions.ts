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

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error || !authData?.user) {
    return redirect('/error'),
    console.log('Login failed:', error)
  }
// 🔍 Check if profile exists
const { data: profileCheck, error: profileCheckError } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', authData.user.id)
  .single();

if (profileCheckError && profileCheckError.code !== 'PGRST116') {
  console.log('Profile fetch failed:', profileCheckError);
  redirect('/error');
}

// 🧱 If profile is missing, insert it
if (!profileCheck) {
  const { error: insertError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    email: authData.user.email,
    full_name: authData.user.user_metadata.full_name,
    role: authData.user.user_metadata.role || 'USER',
  });

  if (insertError) {
    console.log('Profile insert failed:', insertError);
    return redirect('/error');
  }
}


  // 🔍 Fetch the user's role from your profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !profile?.role) {
    redirect('/error'),
    console.log('Profile fetch failed:', profileError)
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
