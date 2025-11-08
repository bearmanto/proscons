import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// RLS-aware reads for Server Components / Route Handlers
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) =>
        cookieStore.set({ name, value, ...options }),
      remove: (name: string, options: any) =>
        cookieStore.set({ name, value: "", ...options, maxAge: 0 }),
    },
  });
}

// Elevated server-only client (bypasses RLS). Never import in client code.
export function supabaseAdmin() {
  return createClient(url, service, { auth: { persistSession: false } });
}
