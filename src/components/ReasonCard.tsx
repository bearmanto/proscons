'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Minus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { track } from '@/lib/analytics';

export type ReasonItem = {
  id: string;
  body: string;
  side: 'pro' | 'con';
  created_at: string;
  score: number;
  counts: { up: number; neutral: number; down: number };
  is_featured?: boolean;
};

export default function ReasonCard({ item, onVoted }: { item: ReasonItem; onVoted: () => void }) {
  const [busy, setBusy] = useState(false);

  async function vote(value: -1 | 0 | 1) {
    try {
      setBusy(true);
      const res = await fetch('/api/reason-votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason_id: item.id, value }),
      });
      if (res.status === 429) {
        toast.error('Terlalu cepat. Mohon tunggu sebentar.');
        return;
      }

      if (!res.ok) {
        // Check for specific error like duplicate vote (e.g., status 409 Conflict)
        if (res.status === 409) {
          throw new Error('Anda tidak dapat memberikan suara dua kali.');
        }
        throw new Error('Gagal memberikan suara');
      }

      const type = value === 1 ? 'up' : value === 0 ? 'neutral' : 'down';
      track('reason_vote', { reasonId: item.id, type });
      onVoted();
      // toast.success('Suara Anda tersimpan.'); // Removed as per instruction
    } catch (e: any) {
      console.error(e);
      if (e.message === 'Anda tidak dapat memberikan suara dua kali.') {
        toast.error(e.message);
      } else {
        toast.error('Gagal memberikan suara');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all hover:shadow-md dark:hover:shadow-primary/5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm",
      item.is_featured
        ? "border-amber-400 dark:border-amber-500/50 shadow-amber-100 dark:shadow-amber-900/10"
        : "border-zinc-200 dark:border-zinc-800"
    )}>
      {item.is_featured && (
        <div className="absolute top-0 right-0 p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-bl-xl border-b border-l border-amber-200 dark:border-amber-800/50">
          <Star className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
        </div>
      )}

      <div className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-200 font-medium">
            {item.body}
          </p>
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant="secondary"
              className={cn(
                "shrink-0 font-mono text-[10px] uppercase tracking-wider opacity-70",
                item.score > 0 && "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400",
                item.score < 0 && "text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400"
              )}
            >
              Skor {item.score}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
          <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {item.counts.up}</span>
            <span className="mx-1 opacity-30">|</span>
            <span className="flex items-center gap-1"><Minus className="w-3 h-3" /> {item.counts.neutral}</span>
            <span className="mx-1 opacity-30">|</span>
            <span className="flex items-center gap-1"><ThumbsDown className="w-3 h-3" /> {item.counts.down}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 transition-colors"
              disabled={busy}
              onClick={() => vote(1)}
              title="Setuju"
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
              disabled={busy}
              onClick={() => vote(0)}
              title="Netral"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors"
              disabled={busy}
              onClick={() => vote(-1)}
              title="Tidak Setuju"
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}