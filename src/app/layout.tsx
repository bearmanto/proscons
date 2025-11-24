import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import FluidBackground from '@/components/FluidBackground';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
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
      <body className={`${playfair.variable} ${inter.variable} antialiased font-sans`}>
        <FluidBackground />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
