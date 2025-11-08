import { supabaseServer } from '@/lib/supabase/server';
import VoteToggle from '@/components/VoteToggle';
import ShareMenu from '@/components/ShareMenu';

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
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Pros & Cons</h1>
        {q ? (
          <section className="mt-8 flex flex-col gap-4">
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">{q.title}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Pick a side to get started.</p>
            <VoteToggle slug={q.slug} />
          </section>
        ) : (
          <p className="mt-8 text-sm text-zinc-600">No active question yet.</p>
        )}
      </main>
    </div>
  );
}
