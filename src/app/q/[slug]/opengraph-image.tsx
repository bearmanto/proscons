import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = decodeURIComponent(slug).replace(/-/g, ' ');
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          fontSize: 56,
          fontWeight: 700,
          color: '#111',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        Pros & Cons — {title}
      </div>
    ),
    { ...size }
  );
}
