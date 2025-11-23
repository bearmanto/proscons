import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
    title: 'Kebijakan Privasi',
    description: 'Kebijakan privasi Pro & Kontra.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-primary/20">
            <main className="mx-auto max-w-3xl px-6 py-12 md:py-20">
                <header className="mb-12">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="-ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Beranda
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-6">Kebijakan Privasi</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </header>

                <article className="prose prose-zinc dark:prose-invert max-w-none">
                    <h3>1. Pendahuluan</h3>
                    <p>
                        Selamat datang di Pro & Kontra. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda.
                        Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
                    </p>

                    <h3>2. Informasi yang Kami Kumpulkan</h3>
                    <ul>
                        <li>
                            <strong>Informasi Anonim:</strong> Saat Anda menggunakan layanan kami tanpa login, kami menggunakan <em>cookies</em> atau penyimpanan lokal
                            untuk menyimpan ID sesi sementara (UID) guna melacak aktivitas voting dan argumen Anda di perangkat tersebut.
                        </li>
                        <li>
                            <strong>Informasi Akun:</strong> Jika Anda mendaftar atau login (melalui penyedia pihak ketiga seperti Google atau GitHub),
                            kami akan menerima informasi dasar seperti alamat email dan nama profil Anda.
                        </li>
                        <li>
                            <strong>Konten Pengguna:</strong> Argumen dan suara (voting) yang Anda kirimkan bersifat publik dan dapat dilihat oleh pengguna lain.
                        </li>
                    </ul>

                    <h3>3. Penggunaan Informasi</h3>
                    <p>Kami menggunakan informasi Anda untuk:</p>
                    <ul>
                        <li>Menyediakan dan memelihara layanan Pro & Kontra.</li>
                        <li>Mencegah penyalahgunaan dan spam (misalnya, mencegah voting ganda).</li>
                        <li>Menyinkronkan aktivitas Anda antar perangkat jika Anda login.</li>
                    </ul>

                    <h3>4. Cookies</h3>
                    <p>
                        Kami menggunakan cookies esensial untuk menjaga sesi login Anda dan preferensi anonim.
                        Dengan menggunakan layanan kami, Anda menyetujui penggunaan cookies ini.
                    </p>

                    <h3>5. Keamanan Data</h3>
                    <p>
                        Kami berusaha sebaik mungkin untuk melindungi data Anda, namun perlu diingat bahwa tidak ada metode transmisi melalui internet
                        atau penyimpanan elektronik yang 100% aman.
                    </p>

                    <h3>6. Hubungi Kami</h3>
                    <p>
                        Jika Anda memiliki pertanyaan tentang kebijakan ini, silakan hubungi kami melalui repositori GitHub kami.
                    </p>
                </article>
            </main>
        </div>
    );
}
