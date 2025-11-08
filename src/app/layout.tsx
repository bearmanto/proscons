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
    default: 'Pros & Cons',
    template: '%s · Pros & Cons',
  },
  description: 'Vote pro or con, explain your reasoning, and rank the best arguments.',
  openGraph: {
    type: 'website',
    title: 'Pros & Cons',
    description: 'Vote pro or con, explain your reasoning, and rank the best arguments.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pros & Cons',
    description: 'Vote pro or con, explain your reasoning, and rank the best arguments.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
