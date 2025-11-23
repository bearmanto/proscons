import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Minus, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type ActivityItem = {
    type: 'reason' | 'vote';
    id: string;
    created_at: string;
    question: {
        title: string;
        slug: string;
    };
    // For reasons
    side?: 'pro' | 'con';
    body?: string;
    score?: number;
    // For votes
    vote_value?: number;
    reason_body?: string;
};

export default function ActivityList({ activities }: { activities: ActivityItem[] }) {
    if (activities.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                <p className="text-zinc-500 dark:text-zinc-400">Belum ada aktivitas.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((item) => (
                <Link
                    key={`${item.type}-${item.id}`}
                    href={`/q/${item.question.slug}`}
                    className="block group"
                >
                    <Card className="p-4 transition-all hover:shadow-md dark:hover:shadow-primary/5 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm group-hover:border-zinc-300 dark:group-hover:border-zinc-700">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                                    {item.type === 'reason' ? (
                                        <>
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            Menulis Argumen
                                        </>
                                    ) : (
                                        <>
                                            {item.vote_value === 1 && <ThumbsUp className="w-3.5 h-3.5" />}
                                            {item.vote_value === 0 && <Minus className="w-3.5 h-3.5" />}
                                            {item.vote_value === -1 && <ThumbsDown className="w-3.5 h-3.5" />}
                                            Memberikan Suara
                                        </>
                                    )}
                                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                    <time dateTime={item.created_at}>
                                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                        })}
                                    </time>
                                </span>

                                {item.type === 'reason' && item.side && (
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "text-[10px] uppercase tracking-wider",
                                            item.side === 'pro'
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                                : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                                        )}
                                    >
                                        {item.side}
                                    </Badge>
                                )}
                            </div>

                            <h4 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors line-clamp-1">
                                {item.question.title}
                            </h4>

                            {item.type === 'reason' ? (
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                                    "{item.body}"
                                </p>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <span className="text-zinc-400">untuk:</span>
                                    <p className="line-clamp-1 italic">"{item.reason_body}"</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
