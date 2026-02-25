'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import {
    GraduationCap,
    Menu,
    X,
    LogIn,
    ChevronDown,
    UserCircle,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function LandingNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navItems = [
        { label: 'Home', href: '#' },
        { label: 'Courses', href: '#courses' },
        { label: 'About Us', href: '#about' },
        { label: 'Contact', href: '#contact' },
    ];

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLoginOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            SRAJ <span className="text-primary text-slate-900 dark:text-white">CLASSES</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-sm font-bold text-slate-600 dark:text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-4">
                            <ThemeToggle />

                            {/* Unified Login Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsLoginOpen(!isLoginOpen)}
                                    className="btn-primary group relative overflow-hidden px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-tighter flex items-center gap-2 shadow-xl shadow-primary/20"
                                >
                                    <span className="relative z-10 text-white">Login</span>
                                    <ChevronDown className={cn("h-4 w-4 relative z-10 transition-transform", isLoginOpen ? "rotate-180" : "")} />
                                </button>

                                {isLoginOpen && (
                                    <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                                        <Link
                                            href="/student/login"
                                            onClick={() => setIsLoginOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                                                <UserCircle className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Student Login</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">LMS Portal</p>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsLoginOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <ShieldCheck className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Admin Login</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Management</p>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
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
                isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="px-6 py-8 space-y-4 text-slate-900 dark:text-white">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-lg font-black text-slate-600 dark:text-muted-foreground hover:text-primary transition-all uppercase tracking-widest"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="pt-6 border-t border-black/5 dark:border-white/5 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Appearance</span>
                            <ThemeToggle />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Link
                                href="/student/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-primary/20 bg-primary/5 text-primary shadow-sm"
                            >
                                <UserCircle className="h-6 w-6" />
                                <span className="font-black text-xs uppercase tracking-tighter">Student</span>
                            </Link>
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="btn-primary flex flex-col items-center gap-2 p-4 rounded-2xl font-black shadow-xl shadow-primary/30"
                            >
                                <ShieldCheck className="h-6 w-6 text-white" />
                                <span className="font-black text-xs uppercase tracking-tighter text-white">Admin</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
