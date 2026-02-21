'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import {
    GraduationCap,
    Menu,
    X,
    LayoutDashboard,
    Users,
    ReceiptIndianRupee,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: GraduationCap, label: 'Applications', href: '/dashboard/enrollments' },
    { icon: Users, label: 'Students', href: '/students' },
    { icon: ReceiptIndianRupee, label: 'Collect Fee', href: '/billing' },
    { icon: FileText, label: 'Fee Invoices', href: '/invoices' },
    { icon: BarChart3, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();

    // Close user menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                router.push('/');
                router.refresh(); // Refresh to update auth state/middleware
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="nav-blur sticky top-0 z-50 w-full border-b border-white/10 glass shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <GraduationCap className="h-7 w-7 text-primary" />
                            </div>
                            <span className="text-xl font-black tracking-tight">
                                <span className="logo-text">SRAJ</span>{' '}
                                <span className="text-primary">CLASSES</span>
                            </span>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2",
                                        pathname === item.href
                                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="sm:flex h-9 w-9 rounded-full bg-primary/10 items-center justify-center border border-primary/20 cursor-pointer hover:bg-primary/20 transition-all duration-200 group overflow-hidden"
                            >
                                <span className="text-xs font-black text-primary group-hover:scale-110 transition-transform">AD</span>
                            </button>

                            {/* User Dropdown */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-[60] rounded-2xl animate-in fade-in zoom-in duration-200">
                                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-2">
                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Admin Access</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">SRAJ Management</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all duration-200"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout Session
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 rounded-xl bg-muted/50 hover:bg-muted text-foreground transition-colors"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Nav */}
            <div className={cn(
                "lg:hidden overflow-hidden transition-all duration-300 border-t border-white/10 bg-background/95 backdrop-blur-xl",
                isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="px-4 pt-4 pb-6 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-bold transition-all duration-200",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}

                    <div className="pt-4 mt-4 border-t border-white/10">
                        <div className="flex items-center justify-between px-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <span className="text-sm font-black text-primary">AD</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold opacity-90">SRAJ Admin</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">Management Power</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-base font-black text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-all duration-200"
                        >
                            <LogOut className="h-5 w-5" />
                            LOGOUT SESSION
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
