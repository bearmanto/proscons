'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Initialize client-side Supabase for Realtime only
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RealtimeVotes({ questionId }: { questionId: string }) {
    const router = useRouter();

    useEffect(() => {
        const channel = supabase
            .channel('realtime_votes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'votes',
                    filter: `question_id=eq.${questionId}`,
                },
                () => {
                    // Refresh the current route to fetch updated data
                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [questionId, router]);

    return null; // Headless component
}
