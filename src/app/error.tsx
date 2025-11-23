'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
                Tali putus!
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-8">
                Terjadi kesalahan di sisi kami. Kami telah mencatat masalah ini dan sedang memperbaikinya.
            </p>
            <Button onClick={reset}>Coba Lagi</Button>
        </div>
    );
}
