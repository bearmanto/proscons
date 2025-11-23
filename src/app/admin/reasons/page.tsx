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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from '@/lib/toast';

export default function AdminReasonsPage() {
    const [reasons, setReasons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState('');

    async function fetchReasons(p = 1, searchQuery = search) {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/reasons?page=${p}&search=${encodeURIComponent(searchQuery)}`);
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
        fetchReasons();
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReasons(1, search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

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

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Moderation</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage user submitted reasons.</p>
                </div>
                <div className="w-64">
                    <Input
                        placeholder="Search reasons..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                                    <TableCell className="text-right">
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
