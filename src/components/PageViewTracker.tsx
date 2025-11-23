'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

export default function PageViewTracker({ name, params }: { name: string; params?: any }) {
    useEffect(() => {
        track(name, params);
    }, [name, params]);

    return null;
}
