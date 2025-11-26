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
  const [showReplies, setShowReplies] = useState(false);

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

  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="flex flex-col gap-2" id={`reason-${item.id}`}>
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-500",
        "bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border-white/20 dark:border-white/10",
        "shadow-sm hover:shadow-md",
        item.is_featured
          ? "border-amber-400/50 dark:border-amber-500/30 shadow-amber-100/50 dark:shadow-amber-900/20"
          : "hover:border-zinc-300/50 dark:hover:border-zinc-700/50"
      )}>
        {item.is_featured && (
          <div className="absolute top-0 right-0 p-1 bg-amber-100 dark:bg-amber-900/30 rounded-bl-lg border-b border-l border-amber-200 dark:border-amber-800/50">
            <Star className="w-3 h-3 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
          </div>
        )}

        <div className="p-3 sm:p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200 font-medium">
              {item.body}
            </p>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant="secondary"
                className={cn(
                  "shrink-0 font-mono text-[10px] uppercase tracking-wider opacity-70 px-1.5 py-0",
                  item.score > 0 && "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400",
                  item.score < 0 && "text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400"
                )}
              >
                {item.score}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-2">
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                  className="h-6 px-2 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  {showReplies ? 'Sembunyikan' : `${item.children!.length} Balasan`}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-0.5">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 transition-colors"
                disabled={busy}
                onClick={() => vote(1)}
                title="Setuju"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                disabled={busy}
                onClick={() => vote(0)}
                title="Netral"
              >
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors"
                disabled={busy}
                onClick={() => vote(-1)}
                title="Tidak Setuju"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 transition-colors ml-1"
                disabled={busy}
                onClick={() => setReplying(!replying)}
                title="Balas"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {replying && (
          <ReplyForm
            questionId={item.question_id}
            parentId={item.id}
            side={item.side}
            onSuccess={() => {
              setReplying(false);
              setShowReplies(true); // Auto-open to show new reply
              onVoted();
            }}
            onCancel={() => setReplying(false)}
          />
        )}
      </Card>

      {/* Render Children */}
      {hasChildren && showReplies && (
        <div className="pl-4 border-l-2 border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
          {item.children!.map(child => (
            <ReasonCard key={child.id} item={child} onVoted={onVoted} />
          ))}
        </div>
      )}
    </div>
  );
}