'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/lib/toast';
import { Loader2 } from 'lucide-react';

export default function ReplyForm({
    questionId,
    parentId,
    side,
    onSuccess,
    onCancel
}: {
    questionId: string;
    parentId: string;
    side: 'pro' | 'con';
    onSuccess: () => void;
    onCancel: () => void;
}) {
    const [body, setBody] = useState('');
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!body.trim()) return;

        setBusy(true);
        try {
            const res = await fetch('/api/reasons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question_id: questionId, // Note: API infers from slug usually, but we can pass it if we update API or just rely on slug if we had it. 
                    // Wait, the API uses slug to find question_id. 
                    // But we have question_id here.
                    // Let's check API again. It accepts `slug`.
                    // If we don't pass slug, it uses active question.
                    // We should probably pass slug or update API to accept question_id directly.
                    // For now, let's assume we need to pass slug.
                    // But ReasonCard doesn't have slug.
                    // We should pass slug to ReasonCard or update API.
                    // Let's update API to accept question_id as alternative to slug.
                    side,
                    body,
                    parent_id: parentId
                }),
            });

            // Wait, the API requires `slug` or it finds active.
            // If we are replying to an archived question, "active" logic fails.
            // We MUST pass slug or question_id.
            // Since we have question_id, let's update API to accept it.

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Failed to submit');
            }

            setBody('');
            onSuccess();
            toast.success('Argumen balasan ditambahkan.');
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <Textarea
                placeholder={`Tambahkan argumen ${side === 'pro' ? 'pendukung' : 'penentang'}...`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[100px] bg-white dark:bg-zinc-900"
                disabled={busy}
            />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={busy}>
                    Batal
                </Button>
                <Button type="submit" size="sm" disabled={busy || !body.trim()}>
                    {busy && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                    Kirim Balasan
                </Button>
            </div>
        </form>
    );
}
