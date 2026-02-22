'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Lock, User, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Login successful! Redirecting…');
                router.push('/dashboard');
            } else {
                const msg = data.message || 'Invalid credentials';
                setError(msg);
                toast.error(msg);
            }
        } catch (err) {
            const msg = 'Something went wrong. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-primary/10 rounded-2xl">
                            <GraduationCap className="h-10 w-10 text-primary" />
                        </div>
                        <span className="text-3xl font-black tracking-tight">SRAJ <span className="text-primary">CLASSES</span></span>
                    </Link>
                    <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">Admin Authority</h1>
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest leading-none opacity-60">Coaching Management Portal</p>
                </div>

                <div className="glass-card shadow-2xl border-white/10 p-8 md:p-10 rounded-[2.5rem]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold animate-shake">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-12 h-14 bg-muted/30 border-none rounded-2xl font-bold focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="Enter username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="input-field pl-12 h-14 bg-muted/30 border-none rounded-2xl font-bold focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full h-14 rounded-2xl font-black uppercase tracking-tighter text-base shadow-xl shadow-primary/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    Enter Dashboard
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <Link href="/" className="text-xs font-black text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">
                            Return to Website
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
