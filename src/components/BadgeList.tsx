'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Zap, MessageCircle, Scale } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '@/lib/toast';

const BADGE_DEFINITIONS = [
    {
        id: 'pioneer',
        name: 'Pioneer',
        description: 'First vote cast',
        icon: Star,
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
        id: 'thinker',
        name: 'Thinker',
        description: '10 votes cast',
        icon: Zap,
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
        id: 'vocal',
        name: 'Vocal',
        description: '5 reasons posted',
        icon: MessageCircle,
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    // Keep others as placeholders or future implementation
    {
        id: 'balanced',
        name: 'Balanced View',
        description: 'Voted both Pro and Con',
        icon: Scale,
        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
        id: 'trendsetter',
        name: 'Trendsetter',
        description: 'Reason reached 10+ score',
        icon: Trophy,
        color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    },
];

export default function BadgeList() {
    const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBadges() {
            try {
                const res = await fetch('/api/badges');
                if (!res.ok) throw new Error('Failed to fetch badges');
                const data = await res.json();
                const ids = new Set(data.badges.map((b: any) => b.badge_id));
                setUnlockedBadges(ids as Set<string>);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchBadges();
    }, []);

    return (
        <section className="w-full max-w-3xl mx-auto mt-12 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-zinc-500" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Your Badges</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {BADGE_DEFINITIONS.map((badge) => {
                    const isUnlocked = unlockedBadges.has(badge.id);
                    return (
                        <Card
                            key={badge.id}
                            className={`p-4 flex flex-col items-center text-center gap-3 transition-all hover:scale-105 ${isUnlocked
                                ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm'
                                : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800/50 opacity-60 grayscale'
                                }`}
                        >
                            <div className={`p-2.5 rounded-full ${isUnlocked ? badge.color : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'}`}>
                                <badge.icon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{badge.name}</p>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">{badge.description}</p>
                            </div>
                            {isUnlocked && (
                                <Badge variant="secondary" className="text-[9px] h-4 px-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                                    Unlocked
                                </Badge>
                            )}
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}
