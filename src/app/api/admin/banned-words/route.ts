import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { z } from "zod";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const query = url.searchParams.get("q");

        const admin = supabaseAdmin();
        let queryBuilder = admin
            .from("banned_words")
            .select("*")
            .order("created_at", { ascending: false });

        if (query) {
            queryBuilder = queryBuilder.ilike("word", `%${query}%`);
        }

        const { data, error } = await queryBuilder;

        if (error) throw error;

        return NextResponse.json({ ok: true, words: data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

const PostSchema = z.object({
    word: z.string().min(1).toLowerCase().trim(),
});

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const parsed = PostSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid body" }, { status: 400 });
        }

        const admin = supabaseAdmin();
        const { data, error } = await admin
            .from("banned_words")
            .insert([{ word: parsed.data.word }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                return NextResponse.json({ error: "Word already exists" }, { status: 400 });
            }
            throw error;
        }

        return NextResponse.json({ ok: true, word: data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const admin = supabaseAdmin();
        const { error } = await admin
            .from("banned_words")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
