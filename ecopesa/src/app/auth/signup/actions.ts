// app/actions/auth/signup.ts
'use server';
import { createClient } from '@/utils/supabase/server';
import { auth } from 'auth';

export interface SignupState {
  error?: string;
  success?: boolean;
  requiresConfirmation?: boolean;
  message?: string;
  redirectTo?: string;
}

export async function signup(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const supabase = await createClient();
  
  // Basic validation
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();
  const name = formData.get('name')?.toString().trim();
  const role = formData.get('role')?.toString() || 'USER';

  if (!email || !email.includes('@')) {
    return { error: 'Invalid email address' };
  }

  if (!password || password.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }

  if (!name || name.length < 2) {
    return { error: 'Name must be at least 2 characters' };
  }

  try {
    // 1. Auth signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name,role },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    });

    if (authError) throw authError;

    // 2. Create profile
    if (authData.user && authData.session) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email,
        full_name: name,
        role
      });
      console.log("Auth Data:", authData);
      if (profileError) throw profileError;
    }
    

    
  

   let redirectTo = '/dashboard';

   if (role === 'ADMIN') redirectTo = '/dashboard/admin';
   else if (role === 'COLLECTOR') redirectTo = '/dashboard/collector';
    else if (role === 'RECYCLER') redirectTo = '/dashboard/recycler';
   // Add your own custom routes here

   return { success: true, redirectTo };


  } catch (error: any) {
    console.error('Signup error:', error);
    return { 
      error: error.message.includes('User already registered') 
        ? 'Email already in use' 
        : 'Signup failed'
    };
  }
}