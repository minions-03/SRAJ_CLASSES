'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ReceiptIndianRupee,
    BarChart3,
    Settings,
    X,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Students', href: '/students' },
    { icon: ReceiptIndianRupee, label: 'Collect Fee', href: '/billing' },
    { icon: FileText, label: 'Fee Invoices', href: '/invoices' },
    { icon: BarChart3, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 w-64 glass border-r lg:border-none transition-transform duration-300 transform",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center justify-between mb-8 lg:hidden">
                        <span className="text-xl font-bold">SRAJ MENU</span>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-2 flex-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => {
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                    pathname === item.href
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto glass-card p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-2">Developed for</p>
                        <p className="text-sm font-bold">SRAJ Competitive Classes</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
