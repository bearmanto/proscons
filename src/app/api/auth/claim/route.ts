import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const uid = cookieStore.get("uid")?.value ?? null;

    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    if (!uid) return NextResponse.json({ ok: true, moved_reasons: 0, merged_votes: 0 });

    const admin = supabaseAdmin();

    // 1) Move reasons authored while anonymous
    const { data: reasonsMove, error: reasonsErr } = await admin
      .from("reasons")
      .update({ user_id: user.id })
      .eq("uid", uid)
      .is("user_id", null)
      .select("id");
    if (reasonsErr) return NextResponse.json({ error: reasonsErr.message }, { status: 500 });

    // 2) Merge votes: upsert anon votes into (user_id, reason_id); then delete anon rows
    const { data: anonVotes, error: fetchErr } = await admin
      .from("reason_votes")
      .select("reason_id, value")
      .eq("uid", uid)
      .is("user_id", null);
    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });

    let merged = 0;
    if (anonVotes && anonVotes.length) {
      const rows = anonVotes.map((v) => ({ reason_id: v.reason_id, user_id: user.id, value: v.value }));
      const { error: upsertErr } = await admin
        .from("reason_votes")
        .upsert(rows, { onConflict: "user_id,reason_id" });
      if (upsertErr) return NextResponse.json({ error: upsertErr.message }, { status: 500 });
      merged = rows.length;

      const { error: delErr } = await admin
        .from("reason_votes")
        .delete()
        .eq("uid", uid)
        .is("user_id", null);
      if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, moved_reasons: reasonsMove?.length ?? 0, merged_votes: merged });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}
