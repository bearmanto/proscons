import { supabaseServer } from '@/lib/supabase/server';
import QuestionCard from '@/components/QuestionCard';
import { Archive } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'Arsip',
    description: 'Telusuri diskusi dan survei sebelumnya.',
};

export default async function ArchivePage() {
    const db = await supabaseServer();
    const { data: questions } = await db
        .from('questions')
        .select('id, slug, title, created_at, is_active')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-primary/20">
            <main className="mx-auto max-w-3xl px-6 py-12 md:py-20">
                <header className="flex flex-col gap-6 mb-12">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="-ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Beranda
                        </Button>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-zinc-900 dark:bg-white rounded-xl text-white dark:text-zinc-900 shadow-sm">
                            <Archive className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Diskusi Terdahulu</h1>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Jelajahi topik sebelumnya dan lihat bagaimana komunitas memilih.</p>
                        </div>
                    </div>
                </header>

                <section className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {questions && questions.length > 0 ? (
                        questions.map((q) => (
                            <QuestionCard key={q.id} question={q} />
                        ))
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                            <p className="text-zinc-500 dark:text-zinc-400">Tidak ada diskusi ditemukan di arsip.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
