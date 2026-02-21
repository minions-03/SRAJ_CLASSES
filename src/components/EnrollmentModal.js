'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, Send } from 'lucide-react';

export function EnrollmentModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const courses = [
        "SSC CGL / CHSL",
        "Banking Exams",
        "Railway (RRB)",
        "Police / Defense"
    ];

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                setSubmitted(true);
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-background glass-card border border-white/10 shadow-2xl p-8 rounded-[2.5rem] animate-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                {submitted ? (
                    <div className="text-center py-8">
                        <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-6">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-black mb-4">Application Sent!</h3>
                        <p className="text-muted-foreground text-lg mb-8">
                            Thank you for choosing SRAJ Classes. Our admission team will review your data and call you within 24 hours.
                        </p>
                        <button
                            onClick={onClose}
                            className="btn-primary w-full py-4 rounded-2xl font-black text-lg uppercase tracking-tight"
                        >
                            Got It
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h3 className="text-3xl font-black mb-2">Enroll for Admission</h3>
                            <p className="text-muted-foreground">Start your journey to success today.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter your name"
                                    className="input-field py-4"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+91 00000 00000"
                                        className="input-field py-4"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="your@email.com"
                                        className="input-field py-4"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Select Course</label>
                                <select
                                    required
                                    className="input-field py-4 appearance-none cursor-pointer"
                                    value={formData.course}
                                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                >
                                    <option value="">Select a batch</option>
                                    {courses.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm font-bold text-center bg-red-500/10 py-3 rounded-xl">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-5 rounded-2xl font-black text-xl uppercase tracking-tighter shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        Submit Application
                                        <Send className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
