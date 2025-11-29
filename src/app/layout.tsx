import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/sonner";
import FluidBackground from '@/components/FluidBackground';
import { ThemeProvider } from "@/components/theme-provider";

// ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FluidBackground />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
