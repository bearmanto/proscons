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
    // 2. Fetch Votes with Impact
    const { data: votes } = await db
        .from('question_votes')
        .select('side, impact')
        .eq('question_id', id);

    const proVotesList = votes?.filter(v => v.side === 'pro') || [];
    const conVotesList = votes?.filter(v => v.side === 'con') || [];

    const proVotes = proVotesList.length;
    const conVotes = conVotesList.length;

    // Calculate Impact Distribution
    const impactDist = {
        pro: [0, 0, 0, 0, 0], // 0 index unused, 1-4 used
        con: [0, 0, 0, 0, 0],
    };

    proVotesList.forEach(v => {
        const impact = v.impact || 1; // Default to 1 if null (legacy)
        if (impact >= 1 && impact <= 4) impactDist.pro[impact]++;
    });

    conVotesList.forEach(v => {
        const impact = v.impact || 1;
        if (impact >= 1 && impact <= 4) impactDist.con[impact]++;
    });

    // 3. Reasons & Replies
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

    // 4. Top Reasons
    const topPro = [...proReasons].sort((a, b) => b.score - a.score).slice(0, 5);
    const topCon = [...conReasons].sort((a, b) => b.score - a.score).slice(0, 5);

    const stats = {
        votes: {
            pro: proVotes,
            con: conVotes,
            total: proVotes + conVotes,
        },
        impact: impactDist,
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
