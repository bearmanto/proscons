import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonOrPublishable =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// RLS-aware client for Server Components / Route Handlers
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(url, anonOrPublishable, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // If called from a Server Component, set() is ignored.
          // Middleware will refresh cookies for SSR flows.
        }
      },
    },
  });
}

// Elevated server-only client (bypasses RLS). Never import in client code.
export function supabaseAdmin() {
  return createClient(url, service, { auth: { persistSession: false } });
}
