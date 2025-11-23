'use client';

export default function Background() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Base Background */}
            <div className="absolute inset-0 bg-zinc-50 dark:bg-black" />

            {/* Fluid Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-[-10%] right-[-20%] w-[60vw] h-[60vw] bg-yellow-200/30 dark:bg-yellow-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[80vw] bg-pink-200/30 dark:bg-pink-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen" />

            {/* Noise Texture Overlay for texture */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'url("/noise.png")' }} />
        </div>
    );
}
