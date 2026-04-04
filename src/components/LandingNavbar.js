'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import {
    GraduationCap,
    Menu,
    X,
    ChevronDown,
    UserCircle,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function LandingNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);

    const navItems = [
        { label: 'Home', href: '#' },
        { label: 'Courses', href: '#courses' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLoginOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-500",
                scrolled
                    ? "glass nav-scrolled border-b border-border/40"
                    : "bg-transparent border-b border-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-18 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-300">
                            <GraduationCap className="h-7 w-7 text-primary" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-foreground">
                            SRAJ <span className="text-gradient">CLASSES</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative px-4 py-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/60"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2">
                            <ThemeToggle />

                            {/* Login Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsLoginOpen(!isLoginOpen)}
                                    className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer"
                                >
                                    <span className="relative z-10">Login</span>
                                    <ChevronDown className={cn("h-4 w-4 relative z-10 transition-transform duration-300", isLoginOpen ? "rotate-180" : "")} />
                                </button>

                                <div className={cn(
                                    "absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-xl p-1.5 transition-all duration-300 origin-top-right",
                                    isLoginOpen
                                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                                )}>
                                    <Link
                                        href="/student/login"
                                        onClick={() => setIsLoginOpen(false)}
                                        className="flex items-center gap-3 px-3.5 py-3 rounded-lg hover:bg-muted/80 transition-colors group"
                                    >
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                            <UserCircle className="h-4.5 w-4.5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">Student Login</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">LMS Portal</p>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/login"
                                        onClick={() => setIsLoginOpen(false)}
                                        className="flex items-center gap-3 px-3.5 py-3 rounded-lg hover:bg-muted/80 transition-colors group"
                                    >
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors">
                                            <ShieldCheck className="h-4.5 w-4.5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">Admin Login</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">Management</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl hover:bg-muted/80 text-foreground transition-all"
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <div className={cn(
                "md:hidden overflow-hidden transition-all duration-400 border-t glass",
                isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-transparent"
            )}>
                <div className="px-6 py-6 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl text-[15px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="pt-4 mt-2 border-t border-border/50 space-y-3">
                        <div className="flex items-center justify-between px-4 py-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Appearance</span>
                            <ThemeToggle />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Link
                                href="/student/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-primary/20 bg-primary/5 text-primary"
                            >
                                <UserCircle className="h-5 w-5" />
                                <span className="font-bold text-xs">Student</span>
                            </Link>
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="btn-primary flex flex-col items-center gap-2 p-4 rounded-xl font-bold"
                            >
                                <ShieldCheck className="h-5 w-5 text-white relative z-10" />
                                <span className="font-bold text-xs text-white relative z-10">Admin</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
