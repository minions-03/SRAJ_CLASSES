'use client';

import React from 'react';
import { Navbar } from './Navbar';

export function DashboardLayout({ children }) {
    const [year, setYear] = React.useState('');
    React.useEffect(() => {
        setYear(new Date().getFullYear().toString());
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col bg-background/50">
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <footer className="py-8 border-t border-white/5 bg-background/30 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                        <div>
                            <p className="text-sm font-bold opacity-80">SRAJ Competitive Classes</p>
                            <p className="text-xs text-muted-foreground mt-1">Empowering students for a brighter future.</p>
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                            © {year} SRAJ Management System • All Rights Reserved
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
