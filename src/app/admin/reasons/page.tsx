'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, EyeOff, Loader2, Star } from 'lucide-react';
import { toast } from '@/lib/toast';

export default function AdminReasonsPage() {
    const [reasons, setReasons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState('');
    const [filterSide, setFilterSide] = useState<string>('all');
    const [filterQuestion, setFilterQuestion] = useState<string>('all');
    const [filterDate, setFilterDate] = useState<string>('');
    const [questions, setQuestions] = useState<any[]>([]);

    async function fetchQuestions() {
        try {
            const res = await fetch('/api/admin/questions/list');
            const data = await res.json();
            if (Array.isArray(data)) {
                setQuestions(data);
            }
        } catch (e) {
            console.error(e);
            toast.error('Failed to load questions for filter');
        }
    }

    async function fetchReasons(p = 1) {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', p.toString());
            if (search) params.set('search', search);
            if (filterSide !== 'all') params.set('side', filterSide);
            if (filterQuestion !== 'all') params.set('question_id', filterQuestion); // API expects question_id
            if (filterDate) params.set('date', filterDate);

            const res = await fetch(`/api/admin/reasons?${params.toString()}`);
            const data = await res.json();
            if (data.reasons) {
                setReasons(data.reasons);
                setTotalPages(data.totalPages);
                setPage(data.page);
            }
        } catch (e) {
            console.error(e);
            toast.error('Failed to load reasons');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchQuestions(); // Fetch questions for the filter dropdown
        fetchReasons(); // Initial fetch of reasons
    }, []);

    // Debounce search and filters
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReasons(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search, filterSide, filterQuestion, filterDate]);

    async function toggleDelete(id: string, currentStatus: boolean) {
        // Optimistic update
        setReasons(prev => prev.map(r =>
            r.id === id ? { ...r, deleted_at: currentStatus ? null : new Date().toISOString() } : r
        ));

        try {
            const res = await fetch(`/api/admin/reasons/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deleted: !currentStatus }),
            });
            if (!res.ok) throw new Error('Failed to update');
            toast.success(currentStatus ? 'Reason restored' : 'Reason deleted');
        } catch (e) {
            console.error(e);
            toast.error('Failed to update status');
            // Revert
            fetchReasons(page);
        }
    }

    async function toggleFeatured(id: string, currentStatus: boolean) {
        // Optimistic update
        setReasons(prev => prev.map(r =>
            r.id === id ? { ...r, is_featured: !currentStatus } : r
        ));

        try {
            const res = await fetch(`/api/admin/reasons/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_featured: !currentStatus }),
            });
            if (!res.ok) throw new Error('Failed to update');
            toast.success(currentStatus ? 'Reason unpinned' : 'Reason pinned');
        } catch (e) {
            console.error(e);
            toast.error('Failed to update status');
            // Revert
            fetchReasons(page);
        }
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Moderation</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage user submitted reasons.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                    <select
                        className="h-10 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300"
                        value={filterSide}
                        onChange={(e) => setFilterSide(e.target.value)}
                    >
                        <option value="all">All Sides</option>
                        <option value="pro">Pro</option>
                        <option value="con">Con</option>
                    </select>

                    <select
                        className="h-10 max-w-[200px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 truncate"
                        value={filterQuestion}
                        onChange={(e) => setFilterQuestion(e.target.value)}
                    >
                        <option value="all">All Questions</option>
                        {questions.map((q: any) => (
                            <option key={q.id} value={q.id}>{q.title}</option>
                        ))}
                    </select>

                    <Input
                        type="date"
                        className="w-auto"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />

                    <Input
                        placeholder="Search reasons..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                    />
                </div>
            </header>

            <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Content</TableHead>
                            <TableHead>Side</TableHead>
                            <TableHead>Question</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-400" />
                                </TableCell>
                            </TableRow>
                        ) : reasons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                    No reasons found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reasons.map((r) => (
                                <TableRow key={r.id} className={r.deleted_at ? 'bg-rose-50/50 dark:bg-rose-900/10' : ''}>
                                    <TableCell className="max-w-md">
                                        <p className={`text-sm ${r.deleted_at ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                            {r.body}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={r.side === 'pro' ? 'default' : 'destructive'} className={r.side === 'pro' ? 'bg-emerald-600' : 'bg-rose-600'}>
                                            {r.side.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-zinc-500 max-w-[150px] truncate">
                                        {r.questions?.title || 'Unknown'}
                                    </TableCell>
                                    <TableCell className="text-xs text-zinc-500 whitespace-nowrap">
                                        {new Date(r.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleFeatured(r.id, !!r.is_featured)}
                                            className={r.is_featured ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' : 'text-zinc-400 hover:text-amber-500 hover:bg-amber-50'}
                                            title={r.is_featured ? "Unpin" : "Pin as Featured"}
                                        >
                                            <Star className={`w-4 h-4 ${r.is_featured ? 'fill-amber-500' : ''}`} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleDelete(r.id, !!r.deleted_at)}
                                            className={r.deleted_at ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50' : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'}
                                        >
                                            {r.deleted_at ? (
                                                <>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Restore
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="w-4 h-4 mr-2" />
                                                    Hide
                                                </>
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => fetchReasons(page - 1)}
                    disabled={page <= 1 || loading}
                >
                    Previous
                </Button>
                <span className="text-sm text-zinc-500">
                    Page {page} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    onClick={() => fetchReasons(page + 1)}
                    disabled={page >= totalPages || loading}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
