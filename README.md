# Pro & Kontra

Platform diskusi sosial untuk mengumpulkan argumen pro dan kontra terhadap berbagai topik menarik. Dibangun dengan fokus pada anonimitas, kecepatan, dan pengalaman pengguna yang modern.

## Fitur Utama

-   **Voting & Argumen**: Berikan suara (Pro/Kontra) dan tulis alasanmu.
-   **Sistem Voting Argumen**: Dukung argumen yang menurutmu valid dengan "Setuju", "Netral", atau "Tidak Setuju".
-   **Aktivitas Saya (`/me`)**: Pantau riwayat kontribusi dan suaramu, bahkan saat belum login (menggunakan sesi anonim).
-   **Akun & Sinkronisasi**: Login untuk menyimpan aktivitasmu selamanya dan gabungkan aktivitas anonim sebelumnya.
-   **Arsip Diskusi**: Jelajahi topik-topik yang sudah berlalu.
-   **Gamifikasi (Beta)**: Dapatkan lencana (badges) berdasarkan partisipasimu.
-   **Lokalisasi**: Antarmuka sepenuhnya dalam Bahasa Indonesia.

## Teknologi

Project ini dibangun menggunakan stack modern:

-   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
-   **Bahasa**: TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan `oklch` color palette dan glassmorphism.
-   **Database & Auth**: [Supabase](https://supabase.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Komponen UI**: Radix UI (via shadcn/ui patterns)

## Setup Lokal

1.  **Clone repository**
    ```bash
    git clone https://github.com/bearmanto/proscons.git
    cd proscons
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Buat file `.env.local` dan isi dengan kredensial Supabase Anda:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    ```

4.  **Jalankan Development Server**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser.

## Struktur Database

Project ini menggunakan tabel-tabel berikut di Supabase:

-   `questions`: Topik diskusi.
-   `reasons`: Argumen pro/kontra dari user.
-   `reason_votes`: Suara terhadap argumen user lain.
-   `profiles`: Data user tambahan (untuk gamifikasi/badges).

## Lisensi

MIT
