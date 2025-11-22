import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { randomUUID } from 'crypto';

export async function GET() {
    const db = supabaseAdmin();

    // Clean up existing active questions to avoid confusion
    await db.from('questions').update({ is_active: false }).eq('is_active', true);

    const slug = nanoid(10);
    const { data: q, error: qError } = await db.from('questions').insert({
        title: 'Is AI good for humanity?',
        slug,
        is_active: true,
    }).select().single();

    if (qError) {
        return NextResponse.json({ error: qError.message }, { status: 500 });
    }

    const reasonsData = [
        {
            question_id: q.id,
            side: 'pro',
            body: 'AI can solve complex problems like climate change and disease curing much faster than humans.',
            uid: randomUUID(),
            user_key: randomUUID(),
        },
        {
            question_id: q.id,
            side: 'pro',
            body: 'It automates repetitive tasks, freeing up humans to be more creative and strategic.',
            uid: randomUUID(),
            user_key: randomUUID(),
        },
        {
            question_id: q.id,
            side: 'con',
            body: 'Job displacement is a major concern as AI becomes more capable.',
            uid: randomUUID(),
            user_key: randomUUID(),
        },
        {
            question_id: q.id,
            side: 'con',
            body: 'There are significant ethical risks regarding bias and lack of transparency.',
            uid: randomUUID(),
            user_key: randomUUID(),
        }
    ];

    const { data: reasons, error: rError } = await db.from('reasons').insert(reasonsData).select();

    if (rError) {
        return NextResponse.json({ error: rError.message }, { status: 500 });
    }

    // Generate votes for each reason to simulate scores
    const votes: any[] = [];

    // Helper to generate votes
    const addVotes = (reasonId: string, count: number, value: number) => {
        for (let i = 0; i < count; i++) {
            const voterId = randomUUID();
            votes.push({
                reason_id: reasonId,
                uid: voterId, // Unique voter ID
                user_key: voterId,
                value: value
            });
        }
    };

    // 1. AI solves problems (Pro) - Score 10 (15 up, 2 neutral, 1 down) -> Net +14? No, score is sum. 15*1 + 2*0 + 1*-1 = 14.
    // Let's match the previous desired scores roughly.
    // Target: High score
    if (reasons[0]) addVotes(reasons[0].id, 15, 1);
    if (reasons[0]) addVotes(reasons[0].id, 2, 0);
    if (reasons[0]) addVotes(reasons[0].id, 1, -1);

    // 2. Automates tasks (Pro) - Medium score
    if (reasons[1]) addVotes(reasons[1].id, 8, 1);
    if (reasons[1]) addVotes(reasons[1].id, 1, 0);
    if (reasons[1]) addVotes(reasons[1].id, 2, -1);

    // 3. Job displacement (Con) - High score
    if (reasons[2]) addVotes(reasons[2].id, 12, 1);
    if (reasons[2]) addVotes(reasons[2].id, 3, 0);
    if (reasons[2]) addVotes(reasons[2].id, 1, -1);

    // 4. Ethical risks (Con) - Medium score
    if (reasons[3]) addVotes(reasons[3].id, 9, 1);
    if (reasons[3]) addVotes(reasons[3].id, 2, 0);
    if (reasons[3]) addVotes(reasons[3].id, 1, -1);

    const { error: vError } = await db.from('reason_votes').insert(votes);

    if (vError) {
        return NextResponse.json({ error: vError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Seeded successfully', slug });
}
