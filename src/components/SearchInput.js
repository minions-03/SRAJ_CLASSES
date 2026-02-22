'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SearchInput({
    value,
    onChange,
    onKeyDown,
    onClear,
    placeholder = "Search...",
    className,
    containerClassName,
    ...props
}) {
    return (
        <div className={cn("relative flex-1", containerClassName)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
                type="text"
                placeholder={placeholder}
                className={cn("input-field w-full pl-10 pr-10", className)}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                suppressHydrationWarning
                {...props}
            />
            {value && (
                <button
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Clear search"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
