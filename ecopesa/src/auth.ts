// auth.ts
import NextAuth from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    // Configure your providers (Google, GitHub, Email, etc.)
  ],
  callbacks: {
    async session({ session, user }) {
      // Fetch the user's role from Supabase
      const { data } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: data?.role || 'user',
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // You can add role to JWT if needed
      }
      return token;
    },
  },
});