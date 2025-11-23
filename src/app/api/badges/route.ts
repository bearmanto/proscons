import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getOrSetUserKey } from "@/lib/identity";

export async function GET(request: Request) {
    try {
        const db = await supabaseServer();
        const { data: { user } } = await db.auth.getUser();
        const uid = await getOrSetUserKey();

        let query = db.from('user_badges').select('badge_id, awarded_at');

        if (user) {
            // If logged in, check by user_id OR uid (merged view logic would be better, but simple OR is fine for now)
            // Actually, RLS might restrict this. Let's rely on the fact that we want badges for THIS user.
            // The policy I set was "Public read access", so we can query by any ID.
            // But we want to return badges for the *current* user.
            query = query.or(`user_id.eq.${user.id},uid.eq.${uid}`);
        } else {
            query = query.eq('uid', uid);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ badges: data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
