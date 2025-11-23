'use client';

import { useToastListener, ToastType } from '@/lib/toast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Toaster() {
    const { toasts, dismiss } = useToastListener();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={cn(
                        "pointer-events-auto flex items-center gap-3 p-4 rounded-lg shadow-lg border animate-in slide-in-from-right-full duration-300",
                        "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    )}
                >
                    {t.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                    {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
                    {t.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}

                    <p className="text-sm font-medium flex-1">{t.message}</p>

                    <button
                        onClick={() => dismiss(t.id)}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
