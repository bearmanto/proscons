import { supabaseServer } from '@/lib/supabase/server';
import VoteToggle from '@/components/VoteToggle';
import ShareMenu from '@/components/ShareMenu';
import BadgeList from '@/components/BadgeList';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const db = await supabaseServer();
  const { data: q } = await db
    .from('questions')
    .select('id, slug, title, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const shareUrl = q ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/q/${q.slug}` : '';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-primary/20">
      <main className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zinc-900 dark:bg-white rounded-lg text-white dark:text-zinc-900">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Pro & Kontra</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/archive" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Arsip
            </Link>
            {q && <ShareMenu url={shareUrl} title={q.title} />}
          </div>
        </header>

        {q ? (
          <section className="flex flex-col items-center text-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                {q.title}
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Ikuti diskusi. Pilih satu sisi untuk melihat pendapat orang lain dan tambahkan perspektifmu sendiri.
              </p>
            </div>

            <div className="w-full max-w-sm mt-4">
              <VoteToggle slug={q.slug} />
            </div>

            <BadgeList />
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-4">
              <MessageSquare className="w-8 h-8 text-zinc-400" />
            </div>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">Tidak ada diskusi aktif</h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">Cek kembali nanti untuk topik berikutnya.</p>
          </div>
        )}
      </main>
    </div>
  );
}
