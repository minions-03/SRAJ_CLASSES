'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import {
    GraduationCap,
    Menu,
    X,
    LogIn
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function LandingNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Home', href: '#' },
        { label: 'Courses', href: '#courses' },
        { label: 'About Us', href: '#about' },
        { label: 'Contact', href: '#contact' },
    ];

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    return (
        <header className="fixed top-0 z-50 w-full glass border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all duration-300">
                            <GraduationCap className="h-8 w-8 text-primary" />
                        </div>
                        <span className="text-2xl font-black tracking-tight">
                            <span className="logo-text">SRAJ</span> <span className="text-primary">CLASSES</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-4">
                            <ThemeToggle />
                            <Link
                                href="/login"
                                className="btn-primary group relative overflow-hidden px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-tighter flex items-center gap-2 shadow-xl shadow-primary/20"
                            >
                                <span className="relative z-10">Admin Login</span>
                                <LogIn className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-foreground transition-all shadow-sm border border-black/5 dark:border-white/5"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <div className={cn(
                "md:hidden overflow-hidden transition-all duration-300 border-t border-white/10 bg-background/95 backdrop-blur-2xl",
                isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="px-6 py-8 space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-lg font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-widest"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="pt-6 border-t border-black/5 dark:border-white/5 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Appearance</span>
                            <ThemeToggle />
                        </div>
                        <Link
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="btn-primary w-full py-4 rounded-2xl font-black text-lg uppercase flex items-center justify-center gap-3 shadow-xl shadow-primary/30"
                        >
                            <LogIn className="h-6 w-6" />
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
