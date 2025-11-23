import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // ?title=<title>
        const hasTitle = searchParams.has('title');
        const title = hasTitle
            ? searchParams.get('title')?.slice(0, 100)
            : 'Pro & Kontra';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#000',
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        color: 'white',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px',
                            textAlign: 'center',
                        }}
                    >
                        <div
                            style={{
                                fontSize: 24,
                                fontWeight: 600,
                                color: '#a1a1aa',
                                marginBottom: 20,
                                textTransform: 'uppercase',
                                letterSpacing: 4,
                            }}
                        >
                            Pro & Kontra
                        </div>
                        <div
                            style={{
                                fontSize: 60,
                                fontWeight: 900,
                                lineHeight: 1.1,
                                marginBottom: 20,
                                background: 'linear-gradient(to bottom right, #fff, #a1a1aa)',
                                backgroundClip: 'text',
                                color: 'transparent',
                                padding: '0 20px',
                            }}
                        >
                            {title}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                gap: '40px',
                                marginTop: 20,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#10b981' }} />
                                <span style={{ fontSize: 30, color: '#d4d4d8' }}>Pro</span>
                            </div>
                            <div style={{ width: 2, height: 40, background: '#3f3f46' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: 30, color: '#d4d4d8' }}>Kontra</span>
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f43f5e' }} />
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
