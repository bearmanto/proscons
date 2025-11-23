import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';
export type ToastEvent = { message: string; type: ToastType; id: string };

type Listener = (toast: ToastEvent) => void;

let listeners: Listener[] = [];

function emit(message: string, type: ToastType) {
    const id = Math.random().toString(36).substring(7);
    const event = { message, type, id };
    listeners.forEach((l) => l(event));
}

export const toast = {
    success: (msg: string) => emit(msg, 'success'),
    error: (msg: string) => emit(msg, 'error'),
    info: (msg: string) => emit(msg, 'info'),
};

export function useToastListener() {
    const [toasts, setToasts] = useState<ToastEvent[]>([]);

    useEffect(() => {
        const handler = (event: ToastEvent) => {
            setToasts((prev) => [...prev, event]);
            // Auto dismiss
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== event.id));
            }, 4000);
        };

        listeners.push(handler);
        return () => {
            listeners = listeners.filter((l) => l !== handler);
        };
    }, []);

    return { toasts, dismiss: (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)) };
}
