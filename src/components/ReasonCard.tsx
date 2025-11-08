'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <Card className="p-3 sm:p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <Badge variant={item.score >= 0 ? 'default' : 'secondary'} className="text-xs px-2 py-0.5">
          Score {item.score}
        </Badge>
        <div className="text-[11px] text-zinc-600 dark:text-zinc-400">
          <span className="mr-2">👍 {item.counts.up}</span>
          <span className="mr-2">○ {item.counts.neutral}</span>
          <span>👎 {item.counts.down}</span>
        </div>
      </div>
      <p className="text-sm leading-6 text-zinc-900 dark:text-zinc-100">{item.body}</p>
      <div className="inline-flex gap-2 self-end">
        <Button size="sm" variant="outline" disabled={busy} aria-label="Vote up" onClick={() => vote(1)}>👍</Button>
        <Button size="sm" variant="outline" disabled={busy} aria-label="Vote neutral" onClick={() => vote(0)}>○</Button>
        <Button size="sm" variant="outline" disabled={busy} aria-label="Vote down" onClick={() => vote(-1)}>👎</Button>
      </div>
    </Card>
  );
}