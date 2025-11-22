'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ReasonItem = {
  id: string;
  body: string;
  side: 'pro' | 'con';
  created_at: string;
  score: number;
  counts: { up: number; neutral: number; down: number };
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
      if (!res.ok) throw new Error('vote failed');
      onVoted();
    } catch (e) {
      console.error(e);
      alert('Could not submit vote.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md dark:hover:shadow-primary/5 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-200 font-medium">
            {item.body}
          </p>
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