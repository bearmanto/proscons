import QuestionForm from '@/components/admin/QuestionForm';

export const metadata = {
    title: 'New Question',
};

export default function NewQuestionPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">New Question</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Create a new discussion topic.</p>
            </div>
            <QuestionForm />
        </div>
    );
}
