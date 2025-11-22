import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { getOrSetUserKey } from "@/lib/identity";

const hits = new Map<string, number[]>();
function allow(ip: string, key: string, limit = 40, windowMs = 60_000) {
  const now = Date.now();
  const k = `${ip}:${key}`;
  const arr = hits.get(k) ?? [];
  const fresh = arr.filter((t) => now - t < windowMs);
  fresh.push(now);
  hits.set(k, fresh);
  return fresh.length <= limit;
}

const VoteSchema = z.object({
  reason_id: z.string().uuid(),
  value: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

    // Ensure uid cookie exists (creates it server-side if missing)
    const uid = await getOrSetUserKey();

    if (!allow(ip, `reason-vote:${uid}`)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const json = await request.json().catch(() => ({}));
    const parsed = VoteSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
    }

    // Determine logged-in user (if any)
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    const payload = user
      ? [{ reason_id: parsed.data.reason_id, user_id: user.id, user_key: uid, value: parsed.data.value }]
      : [{ reason_id: parsed.data.reason_id, uid, user_key: uid, value: parsed.data.value }];

    const onConflict = user ? "user_id,reason_id" : "uid,reason_id";

    const { error } = await supabase
      .from("reason_votes")
      .upsert(payload, { onConflict });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}

// Optional: GET /api/reason-votes?reason_id=...
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const reason_id = url.searchParams.get("reason_id");
    if (!reason_id) return NextResponse.json({ error: "reason_id required" }, { status: 400 });

    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from("reason_votes")
      .select("value")
      .eq("reason_id", reason_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const values = (data ?? []).map((d) => d.value ?? 0);
    const score = values.reduce((a, b) => a + (b ?? 0), 0);
    const counts = {
      up: values.filter((v) => v === 1).length,
      neutral: values.filter((v) => v === 0).length,
      down: values.filter((v) => v === -1).length,
    };

    return NextResponse.json({ ok: true, score, counts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}
