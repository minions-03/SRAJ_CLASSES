'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { GraduationCap, Menu } from 'lucide-react';

export function Navbar({ toggleSidebar }) {
    return (
        <nav className="nav-blur px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 rounded-lg hover:bg-muted"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <Link href="/" className="flex items-center gap-2">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold tracking-tight">SRAJ <span className="text-primary">CLASSES</span></span>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-6 mr-6 transition-all">
                    <Link href="/students" className="text-sm font-medium hover:text-primary transition-colors">Students</Link>
                    <Link href="/billing" className="text-sm font-medium hover:text-primary transition-colors">Billing</Link>
                    <Link href="/reports" className="text-sm font-medium hover:text-primary transition-colors">Reports</Link>
                </div>
                <ThemeToggle />
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <span className="text-xs font-bold text-primary">SC</span>
                </div>
            </div>
        </nav>
    );
}
