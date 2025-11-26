'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import confetti from 'canvas-confetti';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { ArrowRight, Check } from 'lucide-react';

export default function VoteToggle({ slug }: { slug: string }) {
  const [side, setSide] = useState<'pro' | 'con' | null>(null);
  const [impact, setImpact] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function submitVote(selectedImpact: number) {
    if (!side) return;
    setImpact(selectedImpact);
    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ side, impact: selectedImpact }),
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
          onClick={() => { setSide('pro'); setImpact(null); }}
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
          onClick={() => { setSide('con'); setImpact(null); }}
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

      {/* Impact Selector */}
      {side && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {side === 'pro' ? 'Seberapa Setuju?' : 'Seberapa Tidak Setuju?'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  disabled={isPending}
                  onClick={() => submitVote(level)}
                  className={cn(
                    "h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all hover:scale-105 active:scale-95",
                    side === 'pro' && level === 1 && "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
                    side === 'pro' && level === 2 && "bg-emerald-300 text-emerald-800 hover:bg-emerald-400",
                    side === 'pro' && level === 3 && "bg-emerald-500 text-white hover:bg-emerald-600",
                    side === 'pro' && level === 4 && "bg-emerald-700 text-white hover:bg-emerald-800",
                    side === 'con' && level === 1 && "bg-rose-100 text-rose-700 hover:bg-rose-200",
                    side === 'con' && level === 2 && "bg-rose-300 text-rose-800 hover:bg-rose-400",
                    side === 'con' && level === 3 && "bg-rose-500 text-white hover:bg-rose-600",
                    side === 'con' && level === 4 && "bg-rose-700 text-white hover:bg-rose-800",
                  )}
                >
                  <span className="text-lg font-bold">{level}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between px-1 text-[10px] text-zinc-400 font-medium">
              <span>{side === 'pro' ? 'Cukup Setuju' : 'Cukup Tidak Setuju'}</span>
              <span>{side === 'pro' ? 'Sangat Setuju' : 'Sangat Tidak Setuju'}</span>
            </div>
          </div>
        </div>
      )}

      {!side && (
        <div className="text-center text-sm text-zinc-400 py-2">
          Pilih posisi Anda untuk mulai
        </div>
      )}
    </div>
  );
}