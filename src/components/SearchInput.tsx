'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

export default function SearchInput({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const [term, setTerm] = useState(searchParams.get('q')?.toString() || '');
    const debouncedTerm = useDebounce(term, 300);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedTerm) {
            params.set('q', debouncedTerm);
        } else {
            params.delete('q');
        }
        router.replace(`${pathname}?${params.toString()}`);
    }, [debouncedTerm, pathname, router, searchParams]);

    return (
        <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
            <Input
                className="pl-10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800 focus:ring-primary/20"
                placeholder={placeholder}
                onChange={(e) => setTerm(e.target.value)}
                defaultValue={searchParams.get('q')?.toString()}
            />
        </div>
    );
}
