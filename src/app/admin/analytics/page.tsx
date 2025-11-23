'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Eye, ThumbsUp, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AnalyticsPage() {
    const [stats, setStats] = useState({ pageViews: 0, votes: 0, reasons: 0 });
    const [recent, setRecent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setStats(data.stats);
                    setRecent(data.recent);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Analytics</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '-' : stats.pageViews}</div>
                        <p className="text-xs text-muted-foreground">Home & Question pages</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '-' : stats.votes}</div>
                        <p className="text-xs text-muted-foreground">Pro/Con selections</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reason Votes</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '-' : stats.reasons}</div>
                        <p className="text-xs text-muted-foreground">Thumbs up/down on arguments</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-sm text-zinc-500">Loading...</p>
                        ) : recent.length === 0 ? (
                            <p className="text-sm text-zinc-500">No activity yet.</p>
                        ) : (
                            recent.map((event) => (
                                <div key={event.id} className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 last:border-0 last:pb-0">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm text-zinc-900 dark:text-zinc-200">
                                            {formatEventName(event.name)}
                                        </span>
                                        <span className="text-xs text-zinc-500 font-mono">
                                            {JSON.stringify(event.payload)}
                                        </span>
                                    </div>
                                    <span className="text-xs text-zinc-400 whitespace-nowrap ml-4">
                                        {formatDistanceToNow(new Date(event.created_at), { addSuffix: true, locale: id })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function formatEventName(name: string) {
    switch (name) {
        case 'home_view': return 'Viewed Home Page';
        case 'question_view': return 'Viewed Question';
        case 'vote': return 'Voted on Question';
        case 'reason_vote': return 'Voted on Reason';
        default: return name;
    }
}
