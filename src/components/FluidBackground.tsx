import { cn } from '@/lib/utils';

export default function FluidBackground({ className }: { className?: string }) {
    return (
        <div className={cn("fixed inset-0 -z-50 overflow-hidden pointer-events-none", className)}>
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen filter" />
            <div className="absolute top-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen filter" />
            <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen filter" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
        </div>
    );
}
