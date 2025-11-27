import { MetadataRoute } from 'next';
import { supabaseServer } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://opinimoo.com';
    const db = await supabaseServer();

    // Fetch all active questions
    const { data: questions } = await db
        .from('questions')
        .select('slug, created_at')
        .eq('is_active', true);

    const questionUrls = questions?.map((q) => ({
        url: `${baseUrl}/q/${q.slug}`,
        lastModified: new Date(q.created_at),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    })) ?? [];

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/archive`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/me`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        ...questionUrls,
    ];
}
