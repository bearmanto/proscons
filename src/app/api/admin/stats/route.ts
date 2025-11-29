import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
    try {
        const admin = supabaseAdmin();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Parallelize queries for speed
        const [
            { count: pageViews },
            { count: votes }, // Legacy event votes
            { count: questionVotes }, // Real question votes
            { count: reasons }, // Real reasons
            { data: recent },
            { data: timeSeriesEvents }
        ] = await Promise.all([
            admin.from('events').select('*', { count: 'exact', head: true }).ilike('name', '%_view'),
            admin.from('events').select('*', { count: 'exact', head: true }).eq('name', 'vote'),
            admin.from('question_votes').select('*', { count: 'exact', head: true }),
            admin.from('reasons').select('*', { count: 'exact', head: true }),
            admin.from('events').select('*').order('created_at', { ascending: false }).limit(50),
            admin.from('events')
                .select('name, created_at')
                .gte('created_at', thirtyDaysAgo.toISOString())
                .order('created_at', { ascending: true })
        ]);

        // Aggregate time-series data
        const dailyStats: Record<string, { date: string; views: number; votes: number }> = {};

        // Initialize last 30 days with 0
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            dailyStats[dateStr] = { date: dateStr, views: 0, votes: 0 };
        }

        timeSeriesEvents?.forEach(event => {
            const dateStr = new Date(event.created_at).toISOString().split('T')[0];
            if (dailyStats[dateStr]) {
                if (event.name.includes('_view')) {
                    dailyStats[dateStr].views++;
                } else if (event.name === 'vote' || event.name === 'reason_vote') {
                    dailyStats[dateStr].votes++;
                }
            }
        });

        const chartData = Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json({
            ok: true,
            stats: {
                pageViews: pageViews || 0,
                votes: (votes || 0) + (questionVotes || 0), // Combine legacy and new votes
                reasons: reasons || 0,
            },
            recent: recent || [],
            chartData
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
