'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { buildShareTargets } from '@/lib/share';
import { Share2, X, Link as LinkIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function Icon({ name, className }: { name: 'wa' | 'tg' | 'x' | 'fb', className?: string }) {
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor', className } as const;
  switch (name) {
    case 'wa':
      return (
        <svg {...props} aria-hidden>
          <path d="M20.52 3.48A11.91 11.91 0 0 0 12.06 0C5.6 0 .34 5.26.34 11.75c0 2.07.53 4.08 1.53 5.87L0 24l6.58-1.86a11.7 11.7 0 0 0 5.48 1.4h.01c6.47 0 11.73-5.26 11.73-11.74 0-3.14-1.23-6.09-3.28-8.32ZM12.06 21.1h-.01a9.73 9.73 0 0 1-4.96-1.36l-.35-.2-3.9 1.1 1.07-3.8-.23-.39a9.8 9.8 0 0 1-1.47-5.2c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.02 6.96 2.87a9.8 9.8 0 0 1 2.89 6.98c0 5.43-4.42 9.85-9.86 9.85Zm5.43-7.35c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.19.3-.77.97-.94 1.18-.17.2-.35.23-.65.08-.3-.15-1.24-.45-2.36-1.44-.87-.77-1.45-1.72-1.62-2.01-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.67-1.61-.92-2.21-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.07 4.49.71.31 1.26.5 1.7.64.72.23 1.38.2 1.9.13.58-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.42-.07-.13-.26-.2-.55-.35Z" />
        </svg>
      );
    case 'tg':
      return (
        <svg {...props} aria-hidden>
          <path d="M21.94 2.27a1.5 1.5 0 0 0-1.6-.2L2.9 9.88a1.5 1.5 0 0 0 .16 2.8l4.9 1.77 1.82 5.58a1.5 1.5 0 0 0 2.6.53l2.64-3.18 4.8 3.48a1.5 1.5 0 0 0 2.35-.9l2.87-16.2a1.5 1.5 0 0 0-.1-.9ZM8.38 13.11l-3.89-1.4 13.32-5.8-7.8 7.1c-.2.18-.33.42-.38.68l-.54 3.2-1.71-3.78Z" />
        </svg>
      );
    case 'x':
      return (
        <svg {...props} aria-hidden>
          <path d="M17.53 2H20l-5.4 6.18L21 22h-6.64l-5.2-7.6L3.92 22H1.45l5.75-6.58L2 2h6.72l4.73 6.73L17.53 2Zm-2.32 18h1.8L8.9 4H7.08l8.13 16Z" />
        </svg>
      );
    case 'fb':
      return (
        <svg {...props} aria-hidden>
          <path d="M13.5 22V12h3l.5-3.5h-3.5V6.5c0-1 .3-1.7 1.8-1.7H17V1.8c-.3 0-1.4-.1-2.6-.1-2.5 0-4.2 1.5-4.2 4.3V8.5H7v3.5h3.2V22h3.3Z" />
        </svg>
      );
  }
}

export default function ShareMenu({ url, title, text }: { url: string; title: string; text?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const msg = text ?? title;
  const targets = buildShareTargets(url, msg);
  const ref = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  // Close on Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const nativeShare = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await (navigator as any).share({ title, text: msg, url });
        setOpen(false);
        return true;
      }
    } catch { }
    return false;
  }, [title, msg, url]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { }
  }, [url]);

  const socialBtnClass = "flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors";

  return (
    <div ref={ref} className="relative inline-block">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={async () => {
          // Prefer native share; otherwise expand
          const usedNative = await nativeShare();
          if (!usedNative) setOpen((v) => !v);
        }}
      >
        <Share2 className="w-4 h-4" />
        Bagikan
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-[280px] rounded-xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Bagikan diskusi ini</span>
            <button
              className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 mb-4">
            <a className={socialBtnClass} aria-label="Share on WhatsApp" href={targets.whatsapp} target="_blank" rel="noopener noreferrer"><Icon name="wa" /></a>
            <a className={socialBtnClass} aria-label="Share on Telegram" href={targets.telegram} target="_blank" rel="noopener noreferrer"><Icon name="tg" /></a>
            <a className={socialBtnClass} aria-label="Share on X" href={targets.x} target="_blank" rel="noopener noreferrer"><Icon name="x" /></a>
            <a className={socialBtnClass} aria-label="Share on Facebook" href={targets.facebook} target="_blank" rel="noopener noreferrer"><Icon name="fb" /></a>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
              <LinkIcon className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                readOnly
                value={url}
                className="flex-1 bg-transparent text-xs text-zinc-600 dark:text-zinc-300 outline-none truncate"
              />
              <button
                onClick={copyLink}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  copied ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500"
                )}
                aria-label="Copy link"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-medium px-1">Salin</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
