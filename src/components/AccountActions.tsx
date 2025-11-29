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
        <div className="flex flex-col gap-6 w-full max-w-sm">
            {/* Sync Section */}
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-4 shadow-sm">
                <div className="space-y-1">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Sinkronisasi Aktivitas</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Gabungkan aktivitas anonim dari perangkat ini ke akun Anda.
                    </p>
                </div>

                {claimed ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg flex items-start gap-2 border border-emerald-100 dark:border-emerald-900/50">
                        <Check className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium">Berhasil disinkronisasi!</p>
                            <p className="text-xs opacity-80 mt-1">
                                {stats?.moved_reasons} argumen dan {stats?.merged_votes} suara ditambahkan.
                            </p>
                        </div>
                    </div>
                ) : (
                    <Button
                        onClick={handleClaim}
                        disabled={claiming}
                        variant="outline"
                        className="w-full gap-2 border-dashed"
                    >
                        {claiming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Klaim Aktivitas Anonim
                    </Button>
                )}
            </div>

            {/* Logout Section */}
            <div className="pt-2">
                <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full gap-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Keluar dari Akun
                </Button>
            </div>
        </div>
    );
}
