'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus, ExternalLink, Pencil, Trash2, BarChart2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Question {
    id: string;
    title: string;
    slug: string;
    is_active: boolean;
    created_at: string;
    starts_at: string | null;
    ends_at: string | null;
}

export default function AdminQuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchQuestions = async () => {
        setLoading(true);
        const supabase = supabaseBrowser();
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching questions:', error);
            toast.error('Failed to fetch questions');
        } else {
            setQuestions(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/questions/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Failed to delete');
            }

            toast.success('Question deleted successfully');
            fetchQuestions(); // Refresh list
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Failed to delete question');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Questions</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage debate topics.</p>
                </div>
                <Link href="/admin/questions/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Question
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border border-zinc-200 dark:border-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                                    No questions found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            questions.map((q) => (
                                <TableRow key={q.id}>
                                    <TableCell className="font-medium">{q.title}</TableCell>
                                    <TableCell className="text-zinc-500">{q.slug}</TableCell>
                                    <TableCell>
                                        <Badge variant={q.is_active ? "default" : "secondary"}>
                                            {q.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-zinc-500">
                                        {format(new Date(q.created_at), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/q/${q.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" title="View Public">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/questions/${q.id}/analytics`}>
                                                <Button variant="ghost" size="icon" title="Analytics">
                                                    <BarChart2 className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/questions/${q.id}`}>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Delete"
                                                className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                onClick={() => handleDelete(q.id)}
                                                disabled={deletingId === q.id}
                                            >
                                                {deletingId === q.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </Button>
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
