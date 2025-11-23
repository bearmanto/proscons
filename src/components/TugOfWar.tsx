'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TugOfWarProps {
    proCount: number;
    conCount: number;
    className?: string;
}

export default function TugOfWar({ proCount, conCount, className }: TugOfWarProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const total = proCount + conCount;
    // Default to 50/50 if no votes
    const proPercent = total === 0 ? 50 : Math.round((proCount / total) * 100);
    const conPercent = 100 - proPercent;

    return (
        <div className={cn("w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex relative", className)}>
            {/* Pro Bar */}
            <div
                className="h-full bg-emerald-500 transition-all duration-1000 ease-out relative"
                style={{ width: mounted ? `${proPercent}%` : '50%' }}
            >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>

            {/* Center Marker */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50 z-10 -translate-x-1/2" />

            {/* Con Bar (Background is already there, but we can add explicit color if needed) */}
            <div
                className="h-full bg-rose-500 transition-all duration-1000 ease-out"
                style={{ width: mounted ? `${conPercent}%` : '50%' }}
            />
        </div>
    );
}
