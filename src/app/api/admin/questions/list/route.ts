import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
    try {
        const db = await supabaseServer();
        const { data: questions, error } = await db
            .from("questions")
            .select("id, title")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json(questions);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
