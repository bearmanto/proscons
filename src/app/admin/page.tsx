import { supabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const metadata = {
    title: 'Admin Dashboard',
};

export default async function AdminDashboard() {
    const db = await supabaseServer();

    // Fetch stats
    const { count: questionCount } = await db.from('questions').select('*', { count: 'exact', head: true });
    const { count: reasonCount } = await db.from('reasons').select('*', { count: 'exact', head: true });
    const { count: voteCount } = await db.from('reason_votes').select('*', { count: 'exact', head: true });

    // Fetch questions
    const { data: questions } = await db
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Overview of platform activity.</p>
                </div>
                <Link href="/admin/questions/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Question
                    </Button>
                </Link>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Questions</h3>
                    <p className="text-3xl font-bold mt-2 text-zinc-900 dark:text-zinc-50">{questionCount || 0}</p>
                </div>
                <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Reasons</h3>
                    <p className="text-3xl font-bold mt-2 text-zinc-900 dark:text-zinc-50">{reasonCount || 0}</p>
                </div>
                <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Votes</h3>
                    <p className="text-3xl font-bold mt-2 text-zinc-900 dark:text-zinc-50">{voteCount || 0}</p>
                </div>
            </div>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent Questions</h2>
                <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions?.map((q) => (
                                <TableRow key={q.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{q.title}</span>
                                            <span className="text-xs text-zinc-500 font-mono">{q.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={q.is_active ? "default" : "secondary"}>
                                            {q.is_active ? 'Active' : 'Closed'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(q.created_at).toLocaleDateString('id-ID')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/q/${q.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" title="View Public">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/questions/${q.id}`}>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </section>
        </div>
    );
}
