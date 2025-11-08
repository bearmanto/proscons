'use client';

import { useEffect, useState, useCallback } from 'react';
import ReasonCard, { ReasonItem } from './ReasonCard';
import { Separator } from '@/components/ui/separator';

function SkeletonCard() {
  return <div className="h-20 rounded-lg bg-zinc-200/70 dark:bg-zinc-700/40 animate-pulse"/>;
}

export default function ReasonList({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pro, setPro] = useState<ReasonItem[]>([]);
  const [con, setCon] = useState<ReasonItem[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reasons?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setPro(json.reasons.pro);
      setCon(json.reasons.con);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section>
        <h3 className="text-lg font-semibold mb-2">Pros</h3>
        <Separator className="mb-3" />
        <div className="flex flex-col gap-3">{Array.from({length:3}).map((_,i)=> <SkeletonCard key={`p${i}`} />)}</div>
      </section>
      <section>
        <h3 className="text-lg font-semibold mb-2">Cons</h3>
        <Separator className="mb-3" />
        <div className="flex flex-col gap-3">{Array.from({length:3}).map((_,i)=> <SkeletonCard key={`c${i}`} />)}</div>
      </section>
    </div>
  );

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section>
        <h3 className="text-lg font-semibold mb-2">Pros</h3>
        <Separator className="mb-3" />
        <div className="flex flex-col gap-3">
          {pro.length === 0 ? <p className="text-sm text-zinc-600">No reasons yet.</p> : pro.map((r) => (
            <ReasonCard key={r.id} item={r} onVoted={load} />
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-lg font-semibold mb-2">Cons</h3>
        <Separator className="mb-3" />
        <div className="flex flex-col gap-3">
          {con.length === 0 ? <p className="text-sm text-zinc-600">No reasons yet.</p> : con.map((r) => (
            <ReasonCard key={r.id} item={r} onVoted={load} />
          ))}
        </div>
      </section>
    </div>
  );
}