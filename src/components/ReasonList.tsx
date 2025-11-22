'use client';

import { useEffect, useState, useCallback } from 'react';
import ReasonCard, { ReasonItem } from './ReasonCard';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

function SkeletonCard() {
  return (
    <div className="h-32 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 animate-pulse border border-zinc-200 dark:border-zinc-800" />
  );
}

export default function ReasonList({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pro, setPro] = useState<ReasonItem[]>([]);
  const [con, setCon] = useState<ReasonItem[]>([]);

  const load = useCallback(async () => {
    // Don't set loading to true on subsequent reloads to avoid flicker
    if (pro.length === 0 && con.length === 0) setLoading(true);
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

  if (error) return (
    <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-sm text-center">
      {error}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            Pro
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
              {loading ? '-' : pro.length}
            </span>
          </h3>
        </div>

        <div className="flex flex-col gap-4 min-h-[200px]">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`p${i}`} />)
          ) : pro.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Belum ada argumen untuk sisi ini.</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Jadilah yang pertama menambahkan pro!</p>
            </div>
          ) : (
            pro.map((r) => <ReasonCard key={r.id} item={r} onVoted={load} />)
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-2">
            Kontra
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
              {loading ? '-' : con.length}
            </span>
          </h3>
        </div>

        <div className="flex flex-col gap-4 min-h-[200px]">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`c${i}`} />)
          ) : con.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Belum ada argumen untuk sisi ini.</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Jadilah yang pertama menambahkan kontra!</p>
            </div>
          ) : (
            con.map((r) => <ReasonCard key={r.id} item={r} onVoted={load} />)
          )}
        </div>
      </section>
    </div>
  );
}