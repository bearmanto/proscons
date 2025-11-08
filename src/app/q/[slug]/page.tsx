import type { Metadata } from 'next';
import { supabaseServer } from '@/lib/supabase/server';
import ReasonList from '@/components/ReasonList';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = await supabaseServer();
  const { data } = await db
    .from('questions')
    .select('title, slug')
    .eq('slug', slug)
    .maybeSingle();
  const title = data?.title ? `${data.title}` : 'Pros & Cons';
  const url = `/q/${slug}`;
  return {
    title,
    description: 'Explore the best reasons for and against this topic and vote on them.',
    openGraph: { title, description: 'Explore the best reasons for and against this topic and vote on them.', url },
    twitter: { title, description: 'Explore the best reasons for and against this topic and vote on them.' },
  };
}

export default async function SummaryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await supabaseServer();
  const { data: q, error } = await db
    .from('questions')
    .select('id, slug, title')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    return <p className="p-6 text-red-600">{error.message}</p>;
  }
  if (!q) {
    return <p className="p-6">Question not found.</p>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{q.title}</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Community reasons. Vote to rank them.</p>
        <div className="mt-6">
          <ReasonList slug={q.slug} />
        </div>
      </main>
    </div>
  );
}