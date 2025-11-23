'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, MessageSquare, Shield, LogOut, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const links = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/questions', label: 'Questions', icon: FileText },
        { href: '/admin/reasons', label: 'Reasons', icon: MessageSquare },
        { href: '/admin/moderation', label: 'Moderation', icon: Shield },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <nav className="w-64 min-h-screen bg-zinc-900 text-zinc-100 p-6 flex flex-col border-r border-zinc-800">
            <div className="mb-8">
                <h1 className="text-xl font-bold tracking-tight">ProsCons Admin</h1>
            </div>

            <div className="flex-1 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-zinc-800 text-white"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {link.label}
                        </Link>
                    );
                })}
            </div>

            <div className="pt-6 border-t border-zinc-800">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    onClick={handleSignOut}
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </Button>
            </div>
        </nav>
    );
}
