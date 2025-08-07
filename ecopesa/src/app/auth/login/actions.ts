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
    redirect('/error'),
    console.log('Login failed:', error)
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
  switch (profile.role) {
    case 'admin':
      redirect('/dashboard/admin')
    case 'recycler':
      redirect('/dashboard/recycler')
    case 'collector':
      redirect('/dashboard/collector')
    case 'user':
      redirect('/dashboard/user')  
    default:
      redirect('/')
  }
}
