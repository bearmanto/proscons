import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await supabaseServer();
        const json = await request.json();
        const { deleted } = json;

        const { error } = await db
            .from("reasons")
            .update({ deleted_at: deleted ? new Date().toISOString() : null })
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
