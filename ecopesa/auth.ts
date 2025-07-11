// src/auth.ts
import { type AuthOptions } from 'next-auth'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'  // Import cookies from next/headers   

export const authOptions: AuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    // Your authentication providers
  ],
  callbacks: {
    async session({ session, user }) {
      const supabase = await createClient()
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, organization_id')
        .eq('id', user.id)
        .single()

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: profile?.role || 'user',
          organization_id: profile?.organization_id,
        }
      }
    }
  }
}

// Server-side auth helper
export async function auth() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, organization_id')
    .eq('id', session.user.id)
    .single()

  return {
    user: {
      ...session.user,
      role: profile?.role || 'user',
      organization_id: profile?.organization_id,
    }
  }
}