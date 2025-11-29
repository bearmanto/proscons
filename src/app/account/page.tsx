import { supabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AccountActions from '@/components/AccountActions';
import BadgeList from '@/components/BadgeList';
import ProfileForm from '@/components/ProfileForm';
import { ModeToggle } from '@/components/ModeToggle';

export const metadata = {
    title: 'Akun',
    description: 'Pengaturan akun Anda.',
};

export default async function AccountPage() {
    const db = await supabaseServer();
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-primary/20">
            <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex flex-col gap-6">
                        <Link href="/me">
                            <Button variant="ghost" size="sm" className="-ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali ke Aktivitas
                            </Button>
                        </Link>

                        <div className="flex items-center gap-4">
                            <ModeToggle />
                            <div className="p-4 bg-zinc-200 dark:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Akun Saya</h1>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Forms */}
                        <div className="lg:col-span-5 space-y-6">
                            <ProfileForm />
                            <AccountActions />
                        </div>

                        {/* Right Column: Badges */}
                        <div className="lg:col-span-7">
                            <BadgeList />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
