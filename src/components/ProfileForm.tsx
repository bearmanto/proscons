'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Profile {
    display_name: string | null;
    age: number | null;
    gender: string | null;
}

export default function ProfileForm() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile>({
        display_name: '',
        age: null,
        gender: null,
    });
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('display_name, age, gender')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile({
                    display_name: data.display_name || '',
                    age: data.age,
                    gender: data.gender,
                });
            }
            setLoading(false);
        }
        loadProfile();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user');

            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: profile.display_name,
                    age: profile.age,
                    gender: profile.gender,
                })
                .eq('id', user.id);

            if (error) throw error;
            toast.success('Profil berhasil diperbarui');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Gagal memperbarui profil');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-4 w-full max-w-sm">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Biodata</h3>

            <div className="space-y-2">
                <Label htmlFor="display_name">Nama Tampilan</Label>
                <Input
                    id="display_name"
                    value={profile.display_name || ''}
                    onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                    placeholder="Nama Anda"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="age">Umur</Label>
                    <Input
                        id="age"
                        type="number"
                        min="0"
                        max="120"
                        value={profile.age || ''}
                        onChange={(e) => setProfile({ ...profile, age: e.target.value ? parseInt(e.target.value) : null })}
                        placeholder="Contoh: 25"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gender">Jenis Kelamin</Label>
                    <Select
                        value={profile.gender || undefined}
                        onValueChange={(val) => setProfile({ ...profile, gender: val })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                            <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Perubahan
            </Button>
        </form>
    );
}
