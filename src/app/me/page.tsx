import { supabaseServer } from '@/lib/supabase/server';
import { getOrSetUserKey } from '@/lib/identity';
import ActivityList from '@/components/ActivityList';
import { ArrowLeft, History, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Aktivitas Saya',
    description: 'Riwayat kontribusi dan suara Anda.',
};

export default async function MePage() {
    const db = await supabaseServer();
    const { data: { user } } = await db.auth.getUser();
    const uid = await getOrSetUserKey();

    // Determine which ID to query with
    const queryId = user ? user.id : uid;
    const idColumn = user ? 'user_id' : 'uid';

    // Fetch Reasons
    const { data: reasons, error: reasonsError } = await db
        .from('reasons')
        .select(`
      id,
      created_at,
      side,
      body,
      questions (title, slug)
    `)
        .eq(idColumn, queryId)
        .order('created_at', { ascending: false });

    if (reasonsError) console.error('[MePage] Reasons Error:', reasonsError);

    // Fetch Votes
    const { data: votes, error: votesError } = await db
        .from('reason_votes')
        .select(`
      id,
      created_at,
      value,
      reasons (
        body,
        questions (title, slug)
      )
    `)
        .eq(idColumn, queryId)
        .order('created_at', { ascending: false });

    if (votesError) console.error('[MePage] Votes Error:', votesError);

    // Transform data for ActivityList
    const activities = [
        ...(reasons || []).map((r: any) => ({
            type: 'reason' as const,
            id: r.id,
            created_at: r.created_at,
            question: r.questions,
            side: r.side,
            body: r.body,
            score: r.score,
        })),
        ...(votes || []).map((v: any) => ({
            type: 'vote' as const,
            id: v.id,
            created_at: v.created_at,
            question: v.reasons?.questions,
            vote_value: v.value,
            reason_body: v.reasons?.body,
        })).filter((v) => v.question) // Filter out votes where relation might be missing
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-zinc-900 dark:bg-white rounded-xl text-white dark:text-zinc-900 shadow-sm">
                                <History className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Aktivitas Saya</h1>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {user ? 'Riwayat akun Anda.' : 'Aktivitas sesi ini (anonim).'}
                                </p>
                            </div>
                        </div>

                        {user ? (
                            <Link href="/account">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <User className="w-4 h-4" />
                                    Akun
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button variant="default" size="sm" className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                                    <User className="w-4 h-4" />
                                    Masuk / Daftar
                                </Button>
                            </Link>
                        )}
                    </div>
                </header>

                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <ActivityList activities={activities} />
                </section>
            </main>
        </div>
    );
}
