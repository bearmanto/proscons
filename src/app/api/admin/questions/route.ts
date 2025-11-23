import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { z } from "zod";

const QuestionSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    is_active: z.boolean(),
    starts_at: z.string().nullable().optional(),
    ends_at: z.string().nullable().optional(),
});

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const parsed = QuestionSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
        }

        const admin = supabaseAdmin();
        const { data, error } = await admin
            .from("questions")
            .insert([parsed.data])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ ok: true, question: data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
