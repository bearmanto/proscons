

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function VoteToggle({ slug }: { slug: string }) {
  const [side, setSide] = useState<'pro' | 'con' | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function submitVote() {
    if (!side) return;
    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ side }),
      });
      startTransition(() => {
        router.push(`/submit/${side}?slug=${encodeURIComponent(slug)}`);
      });
    } catch (e) {
      console.error(e);
      alert('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex items-center gap-2">
        <Button
          type="button"
          variant={side === 'pro' ? 'default' : 'secondary'}
          onClick={() => setSide('pro')}
          className="min-w-24"
        >
          Pro
        </Button>
        <Button
          type="button"
          variant={side === 'con' ? 'default' : 'secondary'}
          onClick={() => setSide('con')}
          className="min-w-24"
        >
          Con
        </Button>
      </div>
      <div>
        <Button
          disabled={!side || isPending}
          onClick={submitVote}
          className="min-w-44"
        >
          {isPending ? 'Moving…' : side ? 'Confirm & explain' : 'Choose a side'}
        </Button>
      </div>
    </div>
  );
}