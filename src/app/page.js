'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LandingNavbar } from '@/components/LandingNavbar';
import { EnrollmentModal } from '@/components/EnrollmentModal';
import {
    GraduationCap,
    BookOpen,
    Target,
    Award,
    ArrowRight,
    CheckCircle2,
    Users,
    Zap,
    FileText,
    Mail,
    Phone,
    MapPin,
    Send,
    Loader2
} from 'lucide-react';

const courses = [
    {
        title: "SSC CGL / CHSL",
        description: "Comprehensive coaching for Combined Graduate Level and Combined Higher Secondary Level exams.",
        icon: FileText,
        color: "from-blue-500 to-indigo-600",
        tag: "Most Popular"
    },
    {
        title: "Banking Exams",
        description: "Expert guidance for IBPS PO, Clerk, SBI, and other nationalized bank competitive exams.",
        icon: BookOpen,
        color: "from-green-500 to-emerald-600",
        tag: "In Demand"
    },
    {
        title: "Railway (RRB)",
        description: "Targeted preparation for RRB NTPC, Group D, and other railway recruitment boards.",
        icon: GraduationCap,
        color: "from-amber-500 to-orange-600",
        tag: "Fast Track"
    },
    {
        title: "Police / Defense",
        description: "Specialized training for State Police, CAPF, and other defense entrance examinations.",
        icon: CheckCircle2,
        color: "from-rose-500 to-pink-600",
        tag: "Goal Oriented"
    }
];

export default function LandingPage() {
    const [isEnrollOpen, setIsEnrollOpen] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactForm),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setContactForm({ name: '', email: '', phone: '', message: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background mesh-gradient selection:bg-primary/30 selection:text-primary">
            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8 animate-fade-in shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Admissions Open for 2026 Batch
                        </div>
                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.95] animate-float">
                            Master Your Future <br />
                            <span className="text-gradient">SRAJ CLASSES</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                            Transform your aspirations into achievements. Expert coaching for <span className="text-foreground font-bold underline decoration-primary decoration-2 underline-offset-4">SSC, Banking, Railways</span> and more.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setIsEnrollOpen(true)}
                                className="group inline-flex items-center justify-center gap-3 px-10 h-16 rounded-2xl text-lg font-black uppercase tracking-tight w-full sm:w-64 cursor-pointer bg-primary text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:opacity-90 transition-all"
                            >
                                Enroll Now
                                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                            </button>

                            {/* Login Options Buttons Removed */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Creative Stats Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { label: "Students Placed", value: "5000+", icon: Users },
                            { label: "Expert Faculty", value: "15+", icon: Award },
                            { label: "Success Rate", value: "98%", icon: Zap },
                            { label: "Active Support", value: "24/7", icon: Target },
                        ].map((stat, i) => (
                            <div key={i} className="glass-morphism p-8 rounded-[2.5rem] text-center group border-white/5 hover:border-primary/20 transition-all">
                                <div className="mb-4 inline-flex p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-4xl font-black mb-2 tracking-tighter">{stat.value}</h3>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section id="courses" className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                                OUR SPECIALIZED <br /><span className="text-primary italic">BATCHES</span>
                            </h2>
                            <p className="text-muted-foreground text-lg font-medium italic">
                                "Success is not an accident. It is hard work, perseverance, learning, and sacrifice."
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="p-4 glass-morphism rounded-3xl border-primary/20 rotate-3">
                                <p className="font-bold text-sm tracking-widest uppercase">New Batch Starts Soon</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {courses.map((course, index) => (
                            <div key={index} className="glow-card glass-card h-full flex flex-col items-start p-8">
                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${course.color} shadow-lg mb-6 group-hover:rotate-6 transition-transform`}>
                                    <course.icon className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                        {course.tag}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight">{course.title}</h3>
                                <p className="text-muted-foreground leading-relaxed flex-1">
                                    {course.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1 space-y-10">
                            <div className="space-y-4">
                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                                    WHY WINNERS <br />CHOOSE <span className="text-primary underline decoration-primary decoration-4 underline-offset-8">SRAJ</span>?
                                </h2>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-8">
                                {[
                                    { title: "Personalized Mentorship", desc: "One-on-one attention for every student's growth.", icon: Users },
                                    { title: "Smart Test Series", desc: "Real-time exam simulation and deep analysis.", icon: Zap },
                                    { title: "Modern Infrastructure", desc: "Digital classrooms with hybrid learning tech.", icon: GraduationCap },
                                    { title: "Updated Material", desc: "Comprehensive notes updated weekly for current trends.", icon: BookOpen },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5 group">
                                        <div className="flex-shrink-0 mt-1 h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-xl mb-2">{item.title}</h4>
                                            <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 relative w-full aspect-square max-w-[500px]">
                            <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-3xl animate-pulse" />
                            <div className="relative h-full w-full glass-morphism rounded-[3rem] border-white/10 p-12 flex flex-col justify-center items-center text-center">
                                <div className="absolute -top-10 -right-10 animate-bounce">
                                    <div className="p-6 bg-yellow-400 rounded-3xl shadow-2xl rotate-12">
                                        <Award className="h-12 w-12 text-black" />
                                    </div>
                                </div>
                                <h3 className="text-5xl font-black mb-6 tracking-tighter">India's Leading <span className="text-primary">Institute</span></h3>
                                <p className="text-xl text-muted-foreground mb-10 font-medium">Join the league of extraordinary achievers today.</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {["SSC Expert", "Banking Guru", "RLY Specialist"].map(tag => (
                                        <div key={tag} className="px-5 py-2.5 glass-morphism rounded-2xl text-xs font-black uppercase tracking-widest border-primary/20">
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-32 bg-muted/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-start">
                        <div>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
                                GET IN <span className="text-primary italic">TOUCH</span>
                            </h2>
                            <p className="text-xl text-muted-foreground mb-12 max-w-lg leading-relaxed font-medium">
                                Have questions? We're here to help you navigate your path to a successful career. Reach out to us anytime.
                            </p>

                            <div className="space-y-5">
                                <div className="flex gap-6 items-center p-6 bg-background border border-border rounded-3xl group hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm flex-shrink-0">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Email Us</p>
                                        <p className="text-lg font-bold text-foreground">srajgs2025@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-center p-6 bg-background border border-border rounded-3xl group hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm flex-shrink-0">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Call Anytime</p>
                                        <p className="text-lg font-bold text-foreground">+91 91556 91893</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-center p-6 bg-background border border-border rounded-3xl group hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm flex-shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Our Location</p>
                                        <p className="text-lg font-bold text-foreground">Patna, Bihar, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background border border-border p-10 md:p-12 rounded-[3rem] shadow-xl">
                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={contactForm.name}
                                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                            className="w-full bg-muted/50 border border-input rounded-2xl px-5 py-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-foreground placeholder:text-muted-foreground/50"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={contactForm.phone}
                                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                            className="w-full bg-muted/50 border border-input rounded-2xl px-5 py-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-foreground placeholder:text-muted-foreground/50"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={contactForm.email}
                                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                        className="w-full bg-muted/50 border border-input rounded-2xl px-5 py-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-foreground placeholder:text-muted-foreground/50"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={contactForm.message}
                                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                        className="w-full bg-muted/50 border border-input rounded-2xl px-5 py-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-foreground placeholder:text-muted-foreground/50 resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary py-5 rounded-2xl text-lg font-black uppercase tracking-tight flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50 group hover:scale-[1.01] transition-all cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {submitStatus === 'success' && (
                                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl text-emerald-600 dark:text-emerald-400 font-bold text-center">
                                        ✓ Message sent! We'll get back to you shortly.
                                    </div>
                                )}
                                {submitStatus === 'error' && (
                                    <div className="p-4 bg-rose-500/10 border border-rose-500/40 rounded-2xl text-rose-600 dark:text-rose-400 font-bold text-center">
                                        ✗ Failed to send message. Please try again.
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <EnrollmentModal isOpen={isEnrollOpen} onClose={() => setIsEnrollOpen(false)} />

            {/* Footer */}
            <footer className="py-20 bg-slate-950 text-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-white/5 pt-20">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="p-2 bg-primary/20 rounded-xl">
                                    <GraduationCap className="h-10 w-10 text-primary" />
                                </div>
                                <span className="text-3xl font-black tracking-tight">
                                    SRAJ <span className="text-primary">CLASSES</span>
                                </span>
                            </Link>
                            <p className="text-white/40 text-lg leading-relaxed max-w-sm font-medium">
                                Empowering the next generation of government officers with quality education and expert mentorship.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-black mb-8 uppercase tracking-[0.3em] text-primary">Explore</h4>
                            <ul className="space-y-4 text-white/60 font-bold">
                                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                                <li><Link href="#courses" className="hover:text-primary transition-colors">Courses</Link></li>
                                <li><Link href="#contact" className="hover:text-primary transition-colors">Contact</Link></li>
                                <li><Link href="/login" className="hover:text-primary transition-colors">Admin Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-black mb-8 uppercase tracking-[0.3em] text-primary">Contact</h4>
                            <ul className="space-y-4 text-white/60 font-bold text-sm">
                                <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> Patna, Bihar, India</li>
                                <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> Srajgs2025@gmail.com</li>
                                <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> +91 91556 91893</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-[10px] uppercase font-black tracking-[0.4em]">
                        © 2026 SRAJ CLASSES MANAGEMENT SYSTEM • BUILT FOR SUCCESS
                    </div>
                </div>
            </footer>
        </div>
    );
}
