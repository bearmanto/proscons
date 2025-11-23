import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Pro & Kontra',
    template: '%s · Pro & Kontra',
  },
  description: 'Pilih pro atau kontra, jelaskan alasanmu, dan peringkatkan argumen terbaik.',
  openGraph: {
    type: 'website',
    title: 'Pro & Kontra',
    description: 'Pilih pro atau kontra, jelaskan alasanmu, dan peringkatkan argumen terbaik.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pro & Kontra',
    description: 'Pilih pro atau kontra, jelaskan alasanmu, dan peringkatkan argumen terbaik.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen relative`}>
        <div className="fixed inset-0 -z-10 h-full w-full bg-zinc-50 dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
