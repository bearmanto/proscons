import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";

// Shared rate limiter
const hits = new Map<string, number[]>();
function allow(ip: string, key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const k = `${ip}:${key}`;
  const arr = hits.get(k) ?? [];
  const fresh = arr.filter((t) => now - t < windowMs);
  fresh.push(now);
  hits.set(k, fresh);
  return fresh.length <= limit;
}

const PostSchema = z.object({
  side: z.enum(["pro", "con"]),
  body: z.string().min(2).max(500),
  // Optional explicit question slug; if omitted, we use the active question
  slug: z.string().min(1).optional(),
});

async function getQuestionIdBySlugOrActive(slug?: string) {
  const admin = supabaseAdmin();
  if (slug) {
    const { data, error } = await admin
      .from("questions")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Question not found");
    return data.id as string;
  }
  const { data, error } = await admin
    .from("questions")
    .select("id, is_active, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("No active question found");
  return data.id as string;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug") ?? undefined;

    const question_id = await getQuestionIdBySlugOrActive(slug);
    const admin = supabaseAdmin();

    // Grab reasons with nested votes to compute score on the server
    const { data, error } = await admin
      .from("reasons")
      .select("id, question_id, side, body, created_at, reason_votes(value)")
      .eq("question_id", question_id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const bySide = { pro: [] as any[], con: [] as any[] };
    for (const r of data ?? []) {
      const votes = (r as any).reason_votes as { value: number }[] | null;
      const values = votes?.map((v) => v.value) ?? [];
      const score = values.reduce((a, b) => a + (b ?? 0), 0);
      const counts = {
        up: values.filter((v) => v === 1).length,
        neutral: values.filter((v) => v === 0).length,
        down: values.filter((v) => v === -1).length,
      };
      const item = { id: r.id, body: r.body, side: r.side, created_at: r.created_at, score, counts };
      (r.side === "pro" ? bySide.pro : bySide.con).push(item);
    }

    // Sort each side by score desc then newest
    const sortFn = (a: any, b: any) => (b.score - a.score) || (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    bySide.pro.sort(sortFn);
    bySide.con.sort(sortFn);

    return NextResponse.json({ ok: true, question_id, reasons: bySide });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const cookieStore = await cookies();
    const uid = cookieStore.get("uid")?.value;
    if (!uid) return NextResponse.json({ error: "uid cookie missing" }, { status: 400 });

    if (!allow(ip, `reason:${uid}`)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const json = await request.json().catch(() => ({}));
    const parsed = PostSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
    }

    const question_id = await getQuestionIdBySlugOrActive(parsed.data.slug);

    const admin = supabaseAdmin();
    const { error } = await admin
      .from("reasons")
      .insert({
        question_id,
        user_key: uid,
        side: parsed.data.side,
        body: parsed.data.body.trim(),
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, question_id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}
