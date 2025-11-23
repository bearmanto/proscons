'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function track(name: string, payload: any = {}) {
    try {
        const admin = supabaseAdmin();

        // Attempt to get user_id from session if possible, but strictly optional
        // We prioritize the action completing over strict user tracking
        let user_id = null;

        // We can add more context here if needed (e.g. user agent, but let's keep it minimal for privacy)

        await admin.from('events').insert({
            name,
            payload,
            user_id,
        });
    } catch (e) {
        // Silently fail to avoid interrupting user flow
        console.error('Analytics Error:', e);
    }
}
