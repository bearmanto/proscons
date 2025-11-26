import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
    try {
        const db = await supabaseServer();
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get("page") ?? "1");
        const limit = 20;
        const offset = (page - 1) * limit;

        const search = url.searchParams.get("search");
        const side = url.searchParams.get("side");
        const questionId = url.searchParams.get("question_id");
        const date = url.searchParams.get("date");

        let query = db
            .from("reasons")
            .select("*, questions(title)", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (search) {
            query = query.ilike("body", `%${search}%`);
        }

        if (side && (side === 'pro' || side === 'con')) {
            query = query.eq("side", side);
        }

        if (questionId) {
            query = query.eq("question_id", questionId);
        }

        if (date) {
            // Filter by specific date (ignoring time)
            // We assume date is passed as YYYY-MM-DD
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            query = query
                .gte("created_at", `${date}T00:00:00`)
                .lt("created_at", nextDate.toISOString().split('T')[0]);
        }

        const { data: reasons, error, count } = await query;

        if (error) throw error;

        return NextResponse.json({ reasons, count, page, totalPages: Math.ceil((count ?? 0) / limit) });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
