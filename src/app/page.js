'use client';

import React from 'react';
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
    FileText
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
    const [isEnrollOpen, setIsEnrollOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-background">
            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6 animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Admissions Open for 2026
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
                            Master Your Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">SRAJ CLASSES</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                            Transform your aspirations into achievements. We provide world-class coaching for SSC, Banking, Railways, and more with expert mentors and a proven track record.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setIsEnrollOpen(true)}
                                className="btn-primary px-8 py-4 rounded-2xl text-lg font-black uppercase tracking-tight flex items-center gap-2 group w-full sm:w-auto cursor-pointer"
                            >
                                Enroll Now
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <Link href="#contact" className="btn-secondary px-8 py-4 rounded-2xl text-lg font-bold w-full sm:w-auto">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Advertisement Section - Creative Stats/Ads */}
            <section className="py-20 relative overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-primary">5000+</h3>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Students Placed</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-primary">15+</h3>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Expert Faculty</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-primary">98%</h3>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Success Rate</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-primary">24/7</h3>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Student Support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section id="courses" className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Our Running Batches</h2>
                        <p className="text-muted-foreground text-lg">Specially designed curriculum to help you crack the toughest exams.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {courses.map((course, index) => (
                            <div key={index} className="glass-card group hover:scale-[1.02] transition-all duration-300 flex flex-col h-full border-none shadow-xl">
                                <div className={`h-2 w-full bg-gradient-to-r ${course.color} absolute top-0 left-0 rounded-t-xl`} />
                                <div className="mt-4 mb-6">
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${course.color} w-fit shadow-lg shadow-primary/20`}>
                                        <course.icon className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <div className="inline-flex mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded">
                                        {course.tag}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black mb-3">{course.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                    {course.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Creative Advertisement / Why Us */}
            <section className="py-24 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                                WHY HUNDREDS OF <span className="text-primary italic">WINNERS</span> CHOOSE US?
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {[
                                    { title: "Personalized Mentorship", desc: "One-on-one attention for every student." },
                                    { title: "Smart Test Series", desc: "Real-time exam simulation and analysis." },
                                    { title: "Modern Infrastructure", desc: "Digital classrooms with hybrid learning." },
                                    { title: "Updated Study Material", desc: "Comprehensive notes updated weekly." },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <CheckCircle2 className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground leading-snug">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 relative w-full aspect-square md:aspect-video lg:aspect-square">
                            <div className="absolute inset-4 rounded-3xl bg-primary/20 animate-pulse blur-2xl" />
                            <div className="relative h-full w-full glass rounded-[2.5rem] border border-white/20 p-8 flex flex-col justify-center items-center text-center overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <Award className="h-20 w-20 text-primary opacity-20 rotate-12" />
                                </div>
                                <GraduationCap className="h-24 w-24 text-primary mb-6" />
                                <h3 className="text-4xl font-black mb-4">India's Leading Coaching Center</h3>
                                <p className="text-lg text-muted-foreground mb-8">Join the league of extraordinary achievers today.</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <div className="px-4 py-2 glass-card rounded-xl text-xs font-bold uppercase tracking-widest border-primary/20">SSC Expert</div>
                                    <div className="px-4 py-2 glass-card rounded-xl text-xs font-bold uppercase tracking-widest border-primary/20">Banking Guru</div>
                                    <div className="px-4 py-2 glass-card rounded-xl text-xs font-bold uppercase tracking-widest border-primary/20">RLY Specialist</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                        READY TO CRACK YOUR EXAM?
                    </h2>
                    <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto">
                        Don't wait for the right moment. Create it. Join our next batch and start your journey towards a government job.
                    </p>
                    <button
                        onClick={() => setIsEnrollOpen(true)}
                        className="bg-white text-primary px-12 py-5 rounded-2xl text-xl font-black uppercase tracking-tight hover:scale-105 transition-transform shadow-2xl shadow-black/20 cursor-pointer"
                    >
                        Enroll for Admission
                    </button>
                </div>
            </section>

            <EnrollmentModal isOpen={isEnrollOpen} onClose={() => setIsEnrollOpen(false)} />

            {/* Footer */}
            <footer className="py-20 bg-slate-950 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <GraduationCap className="h-10 w-10 text-primary" />
                            <span className="text-3xl font-black tracking-tight">
                                SRAJ <span className="text-primary">CLASSES</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                            Empowering the next generation of government officers with quality education and expert mentorship.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-primary">Links</h4>
                        <ul className="space-y-4 text-muted-foreground font-bold">
                            <li><Link href="#" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="#courses" className="hover:text-primary transition-colors">Courses</Link></li>
                            <li><Link href="/login" className="hover:text-primary transition-colors">Admin Login</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-primary">Contact</h4>
                        <ul className="space-y-4 text-muted-foreground font-bold text-sm">
                            <li>Patna, Bihar, India</li>
                            <li>Srajgs2025@gmail.com</li>
                            <li>+91 91556 91893</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-white/10 text-center text-muted-foreground text-xs uppercase font-black tracking-[0.2em]">
                    © 2026 SRAJ CLASSES MANAGEMENT SYSTEM • BUILT FOR SUCCESS
                </div>
            </footer>
        </div>
    );
}
