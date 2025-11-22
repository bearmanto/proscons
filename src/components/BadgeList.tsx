import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Zap, MessageCircle, Scale } from 'lucide-react';

const BADGES = [
    {
        id: 'first-voice',
        name: 'Suara Pertama',
        description: 'Mengirimkan alasan pertamamu',
        icon: MessageCircle,
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        unlocked: true,
    },
    {
        id: 'voter',
        name: 'Pemilih',
        description: 'Memberikan suara pada 10 alasan',
        icon: Star,
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        unlocked: true,
    },
    {
        id: 'debater',
        name: 'Pendebat',
        description: 'Mengirimkan 5 alasan',
        icon: Zap,
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        unlocked: false,
    },
    {
        id: 'balanced',
        name: 'Pandangan Seimbang',
        description: 'Memilih Pro dan Kontra secara seimbang',
        icon: Scale,
        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        unlocked: false,
    },
    {
        id: 'thought-leader',
        name: 'Pemimpin Pemikiran',
        description: 'Alasan mencapai skor 10+',
        icon: Trophy,
        color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        unlocked: false,
    },
];

export default function BadgeList() {
    return (
        <section className="w-full max-w-3xl mx-auto mt-12 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-zinc-500" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Lencana Kamu</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {BADGES.map((badge) => (
                    <Card
                        key={badge.id}
                        className={`p-4 flex flex-col items-center text-center gap-3 transition-all hover:scale-105 ${badge.unlocked
                            ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm'
                            : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800/50 opacity-60 grayscale'
                            }`}
                    >
                        <div className={`p-2.5 rounded-full ${badge.unlocked ? badge.color : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'}`}>
                            <badge.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{badge.name}</p>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">{badge.description}</p>
                        </div>
                        {badge.unlocked && (
                            <Badge variant="secondary" className="text-[9px] h-4 px-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                                Terbuka
                            </Badge>
                        )}
                    </Card>
                ))}
            </div>
        </section>
    );
}
