import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = supabaseAdmin();
        const json = await request.json();
        const { deleted, is_featured } = json;

        const updates: any = {};
        if (typeof deleted !== 'undefined') {
            updates.deleted_at = deleted ? new Date().toISOString() : null;
        }
        if (typeof is_featured !== 'undefined') {
            updates.is_featured = is_featured;
        }

        const { error } = await db
            .from("reasons")
            .update(updates)
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
