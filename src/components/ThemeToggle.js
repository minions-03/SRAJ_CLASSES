'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative p-2.5 rounded-xl hover:bg-muted/80 transition-all duration-300 group"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="h-[18px] w-[18px] text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
            ) : (
                <Moon className="h-[18px] w-[18px] text-slate-600 group-hover:-rotate-12 transition-transform duration-500" />
            )}
        </button>
    );
}
