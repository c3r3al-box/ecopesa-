'use client';

import { createBrowserClient } from '@supabase/ssr';

// ✅ Factory function (for SSR or dynamic usage)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ✅ Singleton instance (for React context, hooks, etc.)
export const supabase = createClient();
export { createBrowserClient };

