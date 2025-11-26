import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";

// Simple in-memory rate limiter (per-IP+uid+endpoint). Good enough for dev.
const hits = new Map<string, number[]>();
function allow(ip: string, key: string, limit = 12, windowMs = 60_000) {
  const now = Date.now();
  const k = `${ip}:${key}`;
  const arr = hits.get(k) ?? [];
  const fresh = arr.filter((t) => now - t < windowMs);
  fresh.push(now);
  hits.set(k, fresh);
  return fresh.length <= limit;
}

const BodySchema = z.object({
  side: z.enum(["pro", "con"]),
  impact: z.number().min(1).max(4).optional().default(1),
});

async function getActiveQuestionId() {
  const admin = supabaseAdmin();
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

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const cookieStore = await cookies();
    const uid = cookieStore.get("uid")?.value;
    if (!uid) return NextResponse.json({ error: "uid cookie missing" }, { status: 400 });

    if (!allow(ip, `vote:${uid}`)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const json = await request.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
    }

    const question_id = await getActiveQuestionId();

    const admin = supabaseAdmin();
    const { error } = await admin
      .from("question_votes")
      .upsert(
        [{ question_id, user_key: uid, side: parsed.data.side, impact: parsed.data.impact }],
        { onConflict: "question_id,user_key" }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, question_id, side: parsed.data.side });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}
