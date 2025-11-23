import type { Metadata } from 'next';
import { supabaseServer } from '@/lib/supabase/server';
import ReasonList from '@/components/ReasonList';
import Breadcrumb from '@/components/Breadcrumb';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = await supabaseServer();
  const { data } = await db
    .from('questions')
    .select('title, slug')
    .eq('slug', slug)
    .maybeSingle();
  const title = data?.title ? `${data.title}` : 'Pro & Kontra';
  const url = `/q/${slug}`;
  return {
    title,
    description: 'Jelajahi alasan terbaik untuk pro dan kontra topik ini dan berikan suaramu.',
    openGraph: {
      title,
      description: 'Jelajahi alasan terbaik untuk pro dan kontra topik ini dan berikan suaramu.',
      url,
      images: [`/api/og?title=${encodeURIComponent(title)}`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: 'Jelajahi alasan terbaik untuk pro dan kontra topik ini dan berikan suaramu.',
      images: [`/api/og?title=${encodeURIComponent(title)}`],
    },
  };
}

import { notFound } from 'next/navigation';
import PageViewTracker from '@/components/PageViewTracker';

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
    notFound();
  }

  // Fetch reasons for SEO (Structured Data)
  const { data: reasons } = await db
    .from('reasons')
    .select('id, body, side, created_at, reason_votes(value)')
    .eq('question_id', q.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(10); // Limit to top 10 for SEO to keep payload light

  const answers = reasons?.map(r => ({
    '@type': 'Answer',
    text: r.body,
    dateCreated: r.created_at,
    upvoteCount: r.reason_votes?.reduce((a: number, b: { value: number }) => a + b.value, 0) || 0,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://proscons.app'}/q/${q.slug}#${r.id}`,
    author: {
      '@type': 'Person',
      name: 'Anonymous User'
    }
  })) || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: q.title,
      text: `Apa pendapat Anda tentang "${q.title}"? Lihat argumen pro dan kontra.`,
      answerCount: answers.length,
      upvoteCount: 0,
      dateCreated: new Date().toISOString(), // We should probably fetch question creation date
      author: {
        '@type': 'Organization',
        name: 'Pro & Kontra'
      },
      suggestedAnswer: answers
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">


      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <Breadcrumb items={[
            { label: 'Beranda', href: '/' },
            { label: q.title }
          ]} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{q.title}</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Alasan dari komunitas. Berikan suara untuk memeringkatnya.</p>
        <div className="mt-6">
          <ReasonList slug={q.slug} />
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageViewTracker name="question_view" params={{ slug: q.slug }} />
    </div>
  );
}