import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Background from '@/components/Background';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://proscons.app'),
  title: 'Pro & Kontra - Platform Debat Anonim',
  description: 'Tempat aman untuk berdiskusi dan melihat dua sisi dari setiap cerita.',
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Background />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
