import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const db = await supabaseServer();
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: notifications, error } = await db
        .from('notifications')
        .select(`
      *,
      actor:actor_id (
        display_name,
        avatar_url
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
    const db = await supabaseServer();
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, all } = await request.json();

    let query = db.from('notifications').update({ is_read: true }).eq('user_id', user.id);

    if (!all && id) {
        query = query.eq('id', id);
    }

    const { error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
