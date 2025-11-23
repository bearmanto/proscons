import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
    title: 'Syarat dan Ketentuan',
    description: 'Syarat dan ketentuan penggunaan Pro & Kontra.',
};

export default function TermsPage() {
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
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-6">Syarat dan Ketentuan</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </header>

                <article className="prose prose-zinc dark:prose-invert max-w-none">
                    <h3>1. Penerimaan Syarat</h3>
                    <p>
                        Dengan mengakses dan menggunakan Pro & Kontra, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini.
                        Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan ini.
                    </p>

                    <h3>2. Etika Pengguna</h3>
                    <p>Anda setuju untuk:</p>
                    <ul>
                        <li>Menggunakan bahasa yang sopan dan menghormati pengguna lain.</li>
                        <li>Tidak menyebarkan ujaran kebencian, SARA, atau konten ilegal.</li>
                        <li>Tidak melakukan spam atau manipulasi sistem voting.</li>
                    </ul>
                    <p>
                        Kami berhak untuk menghapus konten atau memblokir akses pengguna yang melanggar ketentuan ini tanpa pemberitahuan sebelumnya.
                    </p>

                    <h3>3. Hak Kekayaan Intelektual</h3>
                    <p>
                        Konten yang Anda posting tetap menjadi milik Anda, namun Anda memberikan kami lisensi non-eksklusif untuk menampilkan,
                        mendistribusikan, dan mempromosikan konten tersebut di dalam platform Pro & Kontra.
                    </p>

                    <h3>4. Penafian (Disclaimer)</h3>
                    <p>
                        Layanan ini disediakan "sebagaimana adanya". Kami tidak menjamin bahwa layanan akan selalu tersedia, bebas error,
                        atau aman dari gangguan. Opini yang disampaikan oleh pengguna adalah tanggung jawab masing-masing individu.
                    </p>

                    <h3>5. Perubahan Syarat</h3>
                    <p>
                        Kami dapat memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku efektif segera setelah diposting di halaman ini.
                    </p>
                </article>
            </main>
        </div>
    );
}
