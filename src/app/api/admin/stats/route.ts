import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
    try {
        const admin = supabaseAdmin();

        // Parallelize queries for speed
        const [
            { count: pageViews },
            { count: votes },
            { count: reasons },
            { data: recent }
        ] = await Promise.all([
            admin.from('events').select('*', { count: 'exact', head: true }).ilike('name', '%_view'),
            admin.from('events').select('*', { count: 'exact', head: true }).eq('name', 'vote'),
            admin.from('events').select('*', { count: 'exact', head: true }).eq('name', 'reason_vote'),
            admin.from('events').select('*').order('created_at', { ascending: false }).limit(50)
        ]);

        return NextResponse.json({
            ok: true,
            stats: {
                pageViews: pageViews || 0,
                votes: votes || 0,
                reasons: reasons || 0,
            },
            recent: recent || []
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
