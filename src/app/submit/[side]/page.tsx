

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function SubmitReasonPage() {
  const router = useRouter();
  const params = useParams<{ side: 'pro' | 'con' }>();
  const search = useSearchParams();
  const slug = search.get('slug') || '';
  const side = params.side;
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    if (!slug) {
      alert('Missing question slug. Go back and try again.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/reasons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ side, body, slug }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      router.push(`/q/${encodeURIComponent(slug)}`);
    } catch (e) {
      console.error(e);
      alert('Could not submit.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Explain your reasoning</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          You chose <span className="font-medium">{side?.toUpperCase()}</span>.
        </p>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
          <label className="text-sm text-zinc-700 dark:text-zinc-300">Your reason (2–500 chars)</label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} maxLength={500} required />
          <div className="flex gap-2">
            <Button type="submit" disabled={busy || body.trim().length < 2}>
              {busy ? 'Submitting…' : 'Submit reason'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>Back</Button>
          </div>
        </form>
      </main>
    </div>
  );
}