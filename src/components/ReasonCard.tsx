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
  question_id: string;
  body: string;
  side: 'pro' | 'con';
  created_at: string;
  score: number;
  counts: { up: number; neutral: number; down: number };
  is_featured?: boolean;
  parent_id: string | null;
  impact: number;
  children?: ReasonItem[];
};

import ReplyForm from './ReplyForm';
import { MessageCircle } from 'lucide-react';

export default function ReasonCard({ item, onVoted }: { item: ReasonItem; onVoted: () => void }) {
  const [busy, setBusy] = useState(false);
  const [replying, setReplying] = useState(false);

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
        if (res.status === 409) {
          throw new Error('Anda tidak dapat memberikan suara dua kali.');
        }
        throw new Error('Gagal memberikan suara');
      }

      const type = value === 1 ? 'up' : value === 0 ? 'neutral' : 'down';
      track('reason_vote', { reasonId: item.id, type });
      onVoted();
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
    <div className="flex flex-col gap-4" id={`reason-${item.id}`}>
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1",
        "bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border-white/20 dark:border-white/10",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
        item.is_featured
          ? "border-amber-400/50 dark:border-amber-500/30 shadow-amber-100/50 dark:shadow-amber-900/20"
          : "hover:border-zinc-300/50 dark:hover:border-zinc-700/50"
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
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 transition-colors ml-1"
                disabled={busy}
                onClick={() => setReplying(!replying)}
                title="Balas"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {replying && (
          <ReplyForm
            questionId={item.question_id}
            parentId={item.id}
            side={item.side} // Child inherits side (supports parent) or we can let user choose. Kialo forces support/oppose logic.
            // For now, let's assume a reply is a supporting argument for the parent (nested logic).
            // Wait, if I reply to a Pro argument, am I adding a Pro (support) or Con (oppose)?
            // Kialo allows both.
            // My ReplyForm currently takes `side`.
            // Let's default to same side for now, or update ReplyForm to allow choosing.
            // Given the complexity, let's just pass the parent's side and assume it's a supporting argument for now.
            onSuccess={() => {
              setReplying(false);
              onVoted(); // Reload to show new child
            }}
            onCancel={() => setReplying(false)}
          />
        )}
      </Card>

      {/* Render Children */}
      {item.children && item.children.length > 0 && (
        <div className="pl-6 border-l-2 border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
          {item.children.map(child => (
            <ReasonCard key={child.id} item={child} onVoted={onVoted} />
          ))}
        </div>
      )}
    </div>
  );
}