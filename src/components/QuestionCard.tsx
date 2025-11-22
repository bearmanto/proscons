import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare } from 'lucide-react';

type Question = {
    id: string;
    slug: string;
    title: string;
    created_at: string;
    is_active: boolean;
};

export default function QuestionCard({ question }: { question: Question }) {
    return (
        <Link href={`/q/${question.slug}`} className="block group">
            <Card className="p-4 sm:p-6 transition-all duration-200 hover:shadow-md dark:hover:shadow-primary/5 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm group-hover:border-zinc-300 dark:group-hover:border-zinc-700">
                <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                            {question.title}
                        </h3>
                        {question.is_active ? (
                            <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0">
                                Aktif
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="shrink-0 text-zinc-500 bg-zinc-100 dark:bg-zinc-800">
                                Selesai
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <time dateTime={question.created_at}>
                                {new Date(question.created_at).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Ikuti diskusi</span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
