import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

export default function Breadcrumb({ items, className }: { items: BreadcrumbItem[], className?: string }) {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-zinc-500 dark:text-zinc-400", className)}>
            <Link
                href="/"
                className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                title="Home"
            >
                <Home className="w-4 h-4" />
                <span className="sr-only">Home</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="w-4 h-4 mx-1 text-zinc-400 dark:text-zinc-600" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[200px] sm:max-w-xs">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
