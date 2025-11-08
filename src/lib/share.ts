// Utilities to build social share links
// Docs:
// - Web Share API (navigator.share): MDN
// - Telegram share links: t.me/share?url=...&text=...
// - X (Twitter) Web Intent: twitter.com/intent/tweet
// - Facebook Share Dialog: sharer pulls OG tags from the URL

export function buildShareTargets(url: string, text: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return {
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    telegram: `https://t.me/share/url?url=${u}&text=${t}`,
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  } as const;
}
