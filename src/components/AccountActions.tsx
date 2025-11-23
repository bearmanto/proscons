'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { LogOut, Download, Check, Loader2 } from 'lucide-react';

export default function AccountActions() {
    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [stats, setStats] = useState<{ moved_reasons: number, merged_votes: number } | null>(null);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push('/');
    };

    const handleClaim = async () => {
        try {
            setClaiming(true);
            const res = await fetch('/api/auth/claim', { method: 'POST' });
            if (!res.ok) throw new Error('Claim failed');
            const data = await res.json();
            setStats(data);
            setClaimed(true);
            router.refresh();
        } catch (e) {
            console.error(e);
            alert('Gagal mengklaim aktivitas.');
        } finally {
            setClaiming(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-4">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Sinkronisasi Aktivitas</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Jika Anda sebelumnya berkontribusi tanpa login di perangkat ini, Anda dapat menggabungkan aktivitas tersebut ke akun ini.
                </p>

                {claimed ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium">Berhasil disinkronisasi!</p>
                            <p className="text-xs opacity-80 mt-1">
                                {stats?.moved_reasons} argumen dan {stats?.merged_votes} suara telah ditambahkan ke akun Anda.
                            </p>
                        </div>
                    </div>
                ) : (
                    <Button
                        onClick={handleClaim}
                        disabled={claiming}
                        variant="outline"
                        className="w-full gap-2"
                    >
                        {claiming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Klaim Aktivitas Anonim
                    </Button>
                )}
            </div>

            <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full gap-2"
            >
                <LogOut className="w-4 h-4" />
                Keluar
            </Button>
        </div>
    );
}
