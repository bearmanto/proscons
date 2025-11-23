import { supabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, Pencil } from 'lucide-react';
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
    title: 'Manage Questions',
};

export default async function QuestionsPage() {
    const db = await supabaseServer();

    // Fetch all questions
    const { data: questions } = await db
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Questions</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage all discussion topics.</p>
                </div>
                <Link href="/admin/questions/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Question
                    </Button>
                </Link>
            </header>

            <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questions?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                    No questions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            questions?.map((q) => (
                                <TableRow key={q.id}>
                                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                                        {q.title}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-zinc-500">
                                        {q.slug}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={q.is_active ? "default" : "secondary"}>
                                            {q.is_active ? 'Active' : 'Closed'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-zinc-500">
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
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Pencil className="w-3 h-3" />
                                                    Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
