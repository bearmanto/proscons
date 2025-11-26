import { supabaseServer } from '@/lib/supabase/server';
import QuestionAnalytics from '@/components/admin/QuestionAnalytics';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'Question Analytics',
};

export default async function QuestionAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const db = await supabaseServer();

    // Fetch Question
    const { data: question } = await db
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();

    if (!question) {
        notFound();
    }

    // Fetch Stats
    // 1. Votes (from question_votes table)
    const { count: proVotes } = await db.from('question_votes').select('*', { count: 'exact', head: true }).eq('question_id', id).eq('side', 'pro');
    const { count: conVotes } = await db.from('question_votes').select('*', { count: 'exact', head: true }).eq('question_id', id).eq('side', 'con');

    // 2. Reasons & Replies
    const { data: allReasons } = await db
        .from('reasons')
        .select('id, side, score, body, parent_id')
        .eq('question_id', id)
        .is('deleted_at', null);

    const reasons = allReasons || [];
    const rootReasons = reasons.filter(r => !r.parent_id);
    const replies = reasons.filter(r => r.parent_id);

    const proReasons = rootReasons.filter(r => r.side === 'pro');
    const conReasons = rootReasons.filter(r => r.side === 'con');

    // 3. Top Reasons
    const topPro = [...proReasons].sort((a, b) => b.score - a.score).slice(0, 5);
    const topCon = [...conReasons].sort((a, b) => b.score - a.score).slice(0, 5);

    const stats = {
        votes: {
            pro: proVotes || 0,
            con: conVotes || 0,
            total: (proVotes || 0) + (conVotes || 0),
        },
        reasons: {
            pro: proReasons.length,
            con: conReasons.length,
            total: rootReasons.length,
        },
        replies: replies.length,
        topReasons: {
            pro: topPro,
            con: topCon,
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Link href="/admin/questions">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <span className="text-sm">Back to Questions</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Analytics: {question.title}</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Detailed engagement statistics.</p>
                </div>
            </div>

            <QuestionAnalytics stats={stats} />
        </div>
    );
}
