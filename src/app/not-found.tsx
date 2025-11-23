import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
            <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6 animate-bounce">
                <MessageSquare className="w-10 h-10 text-zinc-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
                Tersesat dalam debat?
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mb-8">
                Halaman yang Anda cari tidak ditemukan atau telah dipindahkan ke arsip.
            </p>
            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/">Kembali ke Beranda</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/archive">Lihat Arsip</Link>
                </Button>
            </div>
        </div>
    );
}
