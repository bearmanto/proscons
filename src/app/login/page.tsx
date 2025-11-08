'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const redirectTo = () => `${window.location.origin}/auth/callback`;

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMsg(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo() },
    });
    setPending(false);
    setMsg(error ? error.message : 'Check your inbox for a sign-in link.');
  }

  async function signInWithGoogle() {
    setPending(true);
    setMsg(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo(),
      },
    });
    setPending(false);
    if (error) setMsg(error.message);
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-xl font-medium mb-4">Sign in</h1>
      <form onSubmit={sendMagicLink} className="space-y-3">
        <label className="block text-sm">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 p-2 text-sm focus:outline-none focus:ring"
            placeholder="you@example.com"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {pending ? 'Sending…' : 'Email me a magic link'}
        </button>
      </form>

      <div className="my-4 text-center text-xs text-zinc-500">or</div>

      <button
        onClick={signInWithGoogle}
        disabled={pending}
        className="w-full rounded border border-zinc-300 px-3 py-2 disabled:opacity-50"
      >
        Continue with Google
      </button>

      {msg && <p className="mt-3 text-sm text-zinc-700">{msg}</p>}
    </div>
  );
}
