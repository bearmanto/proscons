'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ThumbsUp, ThumbsDown, MessageSquare, Users } from 'lucide-react';

interface QuestionAnalyticsProps {
    stats: {
        votes: {
            pro: number;
            con: number;
            total: number;
        };
        reasons: {
            pro: number;
            con: number;
            total: number;
        };
        replies: number;
        topReasons: {
            pro: Array<{ body: string; score: number }>;
            con: Array<{ body: string; score: number }>;
        };
    };
}

export default function QuestionAnalytics({ stats }: QuestionAnalyticsProps) {
    const voteData = [
        { name: 'Pro', value: stats.votes.pro, color: '#10b981' },
        { name: 'Kontra', value: stats.votes.con, color: '#f43f5e' },
    ];

    const reasonData = [
        { name: 'Pro', value: stats.reasons.pro, color: '#10b981' },
        { name: 'Kontra', value: stats.reasons.con, color: '#f43f5e' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.votes.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.votes.pro} Pro / {stats.votes.con} Con
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reasons</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.reasons.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.reasons.pro} Pro / {stats.reasons.con} Con
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Replies</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.replies}</div>
                        <p className="text-xs text-muted-foreground">
                            Nested arguments
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Vote Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={voteData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value">
                                        {voteData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Reason Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reasonData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value">
                                        {reasonData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-emerald-600">Top Pro Arguments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topReasons.pro.map((reason, i) => (
                                <div key={i} className="flex items-start justify-between gap-4 border-b pb-2 last:border-0 last:pb-0">
                                    <p className="text-sm text-muted-foreground line-clamp-2">{reason.body}</p>
                                    <div className="flex items-center gap-1 text-emerald-600 font-medium text-xs whitespace-nowrap">
                                        <ThumbsUp className="w-3 h-3" /> {reason.score}
                                    </div>
                                </div>
                            ))}
                            {stats.topReasons.pro.length === 0 && <p className="text-sm text-muted-foreground">No pro arguments yet.</p>}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-rose-600">Top Con Arguments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topReasons.con.map((reason, i) => (
                                <div key={i} className="flex items-start justify-between gap-4 border-b pb-2 last:border-0 last:pb-0">
                                    <p className="text-sm text-muted-foreground line-clamp-2">{reason.body}</p>
                                    <div className="flex items-center gap-1 text-rose-600 font-medium text-xs whitespace-nowrap">
                                        <ThumbsDown className="w-3 h-3" /> {reason.score}
                                    </div>
                                </div>
                            ))}
                            {stats.topReasons.con.length === 0 && <p className="text-sm text-muted-foreground">No con arguments yet.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
