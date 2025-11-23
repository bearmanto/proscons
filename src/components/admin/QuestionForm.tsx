'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from '@/lib/toast';
import { Loader2 } from 'lucide-react';

type Question = {
    id?: string;
    title: string;
    slug: string;
    description?: string;
    is_active: boolean;
};

export default function QuestionForm({ initialData }: { initialData?: Question }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Question>({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        is_active: initialData?.is_active ?? true,
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData?.id) {
                // Update
                const { error } = await supabase
                    .from('questions')
                    .update(formData)
                    .eq('id', initialData.id);
                if (error) throw error;
                toast.success('Question updated successfully.');
            } else {
                // Create
                const { error } = await supabase
                    .from('questions')
                    .insert([formData]);
                if (error) throw error;
                toast.success('Question created successfully.');
            }

            router.push('/admin');
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g. Is AI good for humanity?"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    placeholder="e.g. ai-good-humanity"
                    className="font-mono"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add some context..."
                    rows={4}
                />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-0.5">
                    <Label className="text-base">Active Status</Label>
                    <p className="text-sm text-zinc-500">
                        If active, this question will be displayed on the home page.
                    </p>
                </div>
                <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
            </div>

            <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="min-w-[100px]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (initialData?.id ? 'Update' : 'Create')}
                </Button>
            </div>
        </form>
    );
}
