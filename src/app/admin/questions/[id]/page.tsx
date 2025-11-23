import { supabaseServer } from '@/lib/supabase/server';
import QuestionForm from '@/components/admin/QuestionForm';
import { notFound } from 'next/navigation';

export const metadata = {
    title: 'Edit Question',
};

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const db = await supabaseServer();
    const { data: question } = await db
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();

    if (!question) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Edit Question</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Update question details.</p>
            </div>
            <QuestionForm initialData={question} />
        </div>
    );
}
