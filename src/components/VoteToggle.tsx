'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Check } from 'lucide-react';

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
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="grid grid-cols-2 gap-3 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setSide('pro')}
          className={cn(
            "relative flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
            side === 'pro'
              ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          )}
        >
          {side === 'pro' && <Check className="w-4 h-4" />}
          Pro
        </button>
        <button
          type="button"
          onClick={() => setSide('con')}
          className={cn(
            "relative flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
            side === 'con'
              ? "bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          )}
        >
          {side === 'con' && <Check className="w-4 h-4" />}
          Kontra
        </button>
      </div>

      <Button
        size="lg"
        disabled={!side || isPending}
        onClick={submitVote}
        className={cn(
          "w-full transition-all duration-300",
          side === 'pro' && "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20",
          side === 'con' && "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20",
          !side && "bg-zinc-900 dark:bg-zinc-100"
        )}
      >
        {isPending ? (
          'Memproses...'
        ) : side ? (
          <span className="flex items-center gap-2">
            Lanjut jelaskan <ArrowRight className="w-4 h-4" />
          </span>
        ) : (
          'Pilih salah satu'
        )}
      </Button>
    </div>
  );
}