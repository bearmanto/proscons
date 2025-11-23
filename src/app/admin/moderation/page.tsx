'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/lib/toast';
import { Loader2, Trash2, Plus, Search } from 'lucide-react';

type BannedWord = {
    id: string;
    word: string;
    created_at: string;
};

export default function ModerationPage() {
    const [words, setWords] = useState<BannedWord[]>([]);
    const [loading, setLoading] = useState(true);
    const [newWord, setNewWord] = useState('');
    const [adding, setAdding] = useState(false);

    const [search, setSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchWords(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    async function fetchWords(query = '') {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/banned-words${query ? `?q=${encodeURIComponent(query)}` : ''}`);
            const json = await res.json();
            if (json.ok) {
                setWords(json.words);
            }
        } catch (e) {
            console.error(e);
            toast.error('Failed to load words');
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!newWord.trim()) return;
        setAdding(true);
        try {
            const res = await fetch('/api/admin/banned-words', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word: newWord }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            // Refresh list if we are not searching, or if the new word matches search
            if (!search || newWord.includes(search)) {
                fetchWords(search);
            }
            setNewWord('');
            toast.success('Word added');
        } catch (e: any) {
            toast.error(e.message || 'Failed to add');
        } finally {
            setAdding(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Remove this word?')) return;
        try {
            const res = await fetch(`/api/admin/banned-words?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            setWords(words.filter(w => w.id !== id));
            toast.success('Word removed');
        } catch (e) {
            toast.error('Failed to remove');
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Moderation</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <h2 className="font-semibold mb-4">Add Banned Word</h2>
                        <form onSubmit={handleAdd} className="flex gap-2">
                            <Input
                                value={newWord}
                                onChange={e => setNewWord(e.target.value)}
                                placeholder="e.g. badword"
                                disabled={adding}
                            />
                            <Button type="submit" disabled={adding || !newWord.trim()}>
                                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold">Banned Words ({words.length})</h2>
                    </div>
                    <Input
                        placeholder="Search words..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-white dark:bg-zinc-900"
                    />
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {words.map(w => (
                                <div key={w.id} className="flex items-center justify-between p-2 rounded border bg-zinc-50 dark:bg-zinc-900">
                                    <span className="font-mono text-sm">{w.word}</span>
                                    <button onClick={() => handleDelete(w.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {words.length === 0 && <p className="text-zinc-500 text-sm col-span-2">No banned words yet.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
