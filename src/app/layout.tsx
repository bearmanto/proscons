import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

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
        <div className="fixed inset-0 z-[-1] h-full w-full bg-zinc-50 dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] pointer-events-none" />
        {children}
      </body>
    </html>
  );
}
