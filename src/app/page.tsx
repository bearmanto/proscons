import { supabaseServer } from '@/lib/supabase/server';
import VoteToggle from '@/components/VoteToggle';
import ShareMenu from '@/components/ShareMenu';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import TugOfWar from '@/components/TugOfWar';
import PageViewTracker from '@/components/PageViewTracker';
import dynamic from 'next/dynamic';
import NotificationBell from '@/components/NotificationBell';

const RealtimeVotes = dynamic(() => import('@/components/RealtimeVotes'));

export async function generateMetadata() {
  const db = await supabaseServer();
  const { data: questions } = await db
    .from('questions')
    .select('id, slug, title, created_at, starts_at, ends_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const now = new Date().toISOString();
  const activeQuestion = questions?.find(question => {
    const start = question.starts_at ? new Date(question.starts_at).toISOString() : null;
    const end = question.ends_at ? new Date(question.ends_at).toISOString() : null;

    if (start && start > now) return false;
    if (end && end < now) return false;
    return true;
  });

  if (!activeQuestion) return {};

  return {
    title: activeQuestion.title,
    openGraph: {
      images: [`/api/og?title=${encodeURIComponent(activeQuestion.title)}`],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/api/og?title=${encodeURIComponent(activeQuestion.title)}`],
    },
  };
}

export default async function Home() {
  const db = await supabaseServer();
  const { data: questions } = await db
    .from('questions')
    .select('id, slug, title, description, created_at, starts_at, ends_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const now = new Date().toISOString();
  const activeQuestion = questions?.find(question => {
    const start = question.starts_at ? new Date(question.starts_at).toISOString() : null;
    const end = question.ends_at ? new Date(question.ends_at).toISOString() : null;

    if (start && start > now) return false;
    if (end && end < now) return false;
    return true;
  });

  const shareUrl = activeQuestion ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/q/${activeQuestion.slug}` : '';

  // Fetch counts for the active question
  let proCount = 0;
  let conCount = 0;

  if (activeQuestion) {
    const { data: votes } = await db
      .from('reasons')
      .select('side, reason_votes(value)')
      .eq('question_id', activeQuestion.id)
      .is('deleted_at', null);

    // Calculate score: Base weight (1) + Net Votes
    // This ensures even 0-vote reasons have presence
    votes?.forEach((r: any) => {
      const netVotes = r.reason_votes?.reduce((a: number, b: { value: number }) => a + b.value, 0) || 0;
      // We only count positive contribution to the "pull"
      // A reason with -5 votes shouldn't pull, but a reason with 0 votes pulls a little (1)
      const weight = Math.max(0, 1 + netVotes);

      if (r.side === 'pro') proCount += weight;
      else conCount += weight;
    });

    // Fallback: if no votes, count reasons
    if (proCount === 0 && conCount === 0) {
      proCount = votes?.filter((r: any) => r.side === 'pro').length || 0;
      conCount = votes?.filter((r: any) => r.side === 'con').length || 0;
    }
  }

  const { data: { user } } = await db.auth.getUser();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-primary/20">
      <main className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zinc-900 dark:bg-white rounded-lg text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase italic">Opinimoo</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/archive" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Arsip
            </Link>
            <Link href="/me" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Saya
            </Link>
            {user && <NotificationBell />}
            {activeQuestion && <ShareMenu url={shareUrl} title={activeQuestion.title} />}
          </div>
        </header>

        {activeQuestion ? (
          <section className="flex flex-col items-center text-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6 max-w-2xl w-full">
              <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                {activeQuestion.title}
              </h2>

              <TugOfWar proCount={proCount} conCount={conCount} className="max-w-md mx-auto shadow-inner" />

              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                {activeQuestion.description || "Ikuti diskusi. Pilih satu sisi untuk melihat pendapat orang lain dan tambahkan perspektifmu sendiri."}
              </p>
            </div>

            <div className="w-full max-w-sm mt-4">
              <VoteToggle slug={activeQuestion.slug} />
            </div>
            {/* Insert RealtimeVotes component here */}
            <RealtimeVotes questionId={activeQuestion.id} />
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Opinimoo',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://proscons.app',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://proscons.app'}/archive?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      <PageViewTracker name="home_view" />
    </div>
  );
}
