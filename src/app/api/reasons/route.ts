import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { getOrSetUserKey } from "@/lib/identity";
import { isProfane } from "@/lib/profanity";

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
  question_id: z.string().optional(),
  parent_id: z.string().optional(),
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
  const now = new Date().toISOString();

  // Fetch potential active questions
  const { data, error } = await admin
    .from("questions")
    .select("id, is_active, created_at, starts_at, ends_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Find the first one that is currently active based on schedule
  const active = data?.find(q => {
    const start = q.starts_at ? new Date(q.starts_at).toISOString() : null;
    const end = q.ends_at ? new Date(q.ends_at).toISOString() : null;

    if (start && start > now) return false;
    if (end && end < now) return false;
    return true;
  });

  if (!active) throw new Error("No active question found");
  return active.id as string;
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
      .select("id, question_id, side, body, created_at, is_featured, parent_id, impact, reason_votes(value)")
      .eq("question_id", question_id)
      .is("deleted_at", null)
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
      const item = { id: r.id, question_id: r.question_id, body: r.body, side: r.side, created_at: r.created_at, score, counts, is_featured: r.is_featured, parent_id: r.parent_id, impact: r.impact };
      (r.side === "pro" ? bySide.pro : bySide.con).push(item);
    }

    // Sort each side by score desc then newest
    const sortFn = (a: any, b: any) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return (b.score - a.score) || (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    };
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

    // Ensure uid cookie exists (creates it server-side if missing)
    const uid = await getOrSetUserKey();

    if (!allow(ip, `reason:${uid}`)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const json = await request.json().catch(() => ({}));
    const parsed = PostSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
    }



    let question_id = parsed.data.question_id;
    if (!question_id) {
      question_id = await getQuestionIdBySlugOrActive(parsed.data.slug);
    }

    // Attach user_id if logged in (SSR client carries the session from cookies)
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    const admin = supabaseAdmin();

    // 1. Check Profanity (DB)
    const { data: banned } = await admin.from('banned_words').select('word');
    const badWords = banned?.map(b => b.word) || [];
    const lowerBody = parsed.data.body.toLowerCase();
    if (badWords.some(w => lowerBody.includes(w))) {
      return NextResponse.json({ error: "Please keep the discussion civil." }, { status: 400 });
    }

    // 2. Check Limit (One reason per user per question) - ONLY for root reasons
    // We check both user_id (if logged in) and uid (cookie)
    if (!parsed.data.parent_id) {
      const { count } = await admin
        .from('reasons')
        .select('*', { count: 'exact', head: true })
        .eq('question_id', question_id)
        .or(user ? `user_id.eq.${user.id},uid.eq.${uid}` : `uid.eq.${uid}`)
        .is('deleted_at', null)
        .is('parent_id', null); // Only check for root reasons

      if (count && count > 0) {
        return NextResponse.json({ error: "You have already submitted a reason for this question." }, { status: 409 });
      }
    }

    const { error } = await supabase
      .from("reasons")
      .insert({
        question_id,
        uid, // keep anonymous key for backfill/claim
        user_key: uid, // legacy column support
        user_id: user?.id ?? null,
        side: parsed.data.side,
        body: parsed.data.body.trim(),
        parent_id: parsed.data.parent_id ?? null,
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, question_id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}
