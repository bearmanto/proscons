'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Notification {
    id: string;
    type: 'reply' | 'badge' | 'vote';
    actor?: {
        display_name: string;
        avatar_url: string;
    };
    resource_slug?: string;
    is_read: boolean;
    created_at: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id?: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                body: JSON.stringify({ id, all: !id }),
            });

            if (id) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
        }
        setIsOpen(false);

        if (notification.type === 'reply' && notification.resource_slug) {
            router.push(`/q/${notification.resource_slug}`);
        } else if (notification.type === 'badge') {
            router.push('/account');
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <Bell className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-black" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                        <h3 className="font-semibold text-sm">Notifikasi</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); markAsRead(); }}
                                className="text-xs text-primary hover:underline"
                            >
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500 text-sm">
                                Belum ada notifikasi
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={cn(
                                        "p-4 border-b border-zinc-50 dark:border-zinc-800/50 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors",
                                        !notification.is_read && "bg-primary/5 dark:bg-primary/10"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <p className="text-sm text-zinc-900 dark:text-zinc-100">
                                                {notification.type === 'reply' && (
                                                    <>
                                                        <span className="font-semibold">{notification.actor?.display_name || 'Seseorang'}</span> membalas argumenmu.
                                                    </>
                                                )}
                                                {notification.type === 'badge' && (
                                                    <>
                                                        Selamat! Kamu mendapatkan lencana baru.
                                                    </>
                                                )}
                                            </p>
                                            <p className="text-xs text-zinc-500 mt-1">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {!notification.is_read && (
                                            <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
