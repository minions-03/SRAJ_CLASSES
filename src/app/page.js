'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    Loader2,
    Star,
    Quote,
    Clock,
    TrendingUp,
    Shield,
    Sparkles
} from 'lucide-react';

const courses = [
    {
        title: "SSC CGL / CHSL",
        description: "Comprehensive coaching for Combined Graduate Level and Combined Higher Secondary Level exams with proven strategies.",
        icon: FileText,
        gradient: "from-indigo-500 to-violet-600",
        accent: "#6366f1",
        tag: "Most Popular"
    },
    {
        title: "Banking Exams",
        description: "Expert guidance for IBPS PO, Clerk, SBI, and other nationalized bank competitive exams with mock tests.",
        icon: TrendingUp,
        gradient: "from-emerald-500 to-teal-600",
        accent: "#10b981",
        tag: "In Demand"
    },
    {
        title: "Railway (RRB)",
        description: "Targeted preparation for RRB NTPC, Group D, and other railway recruitment boards with latest patterns.",
        icon: GraduationCap,
        gradient: "from-amber-500 to-orange-600",
        accent: "#f59e0b",
        tag: "Fast Track"
    },
    {
        title: "Police / Defense",
        description: "Specialized training for State Police, CAPF, and other defense entrance examinations with physical prep guidance.",
        icon: Shield,
        gradient: "from-rose-500 to-pink-600",
        accent: "#f43f5e",
        tag: "Goal Oriented"
    }
];

const testimonials = [
    {
        name: "Rahul Kumar",
        role: "SSC CGL Selected",
        text: "SRAJ Classes transformed my preparation strategy completely. The faculty's approach to problem-solving is unlike anything I've experienced before.",
        rating: 5
    },
    {
        name: "Priya Sharma",
        role: "IBPS PO Selected",
        text: "The mock test series and personalized feedback helped me identify my weak areas. I cracked IBPS PO in my very first attempt!",
        rating: 5
    },
    {
        name: "Amit Singh",
        role: "RRB NTPC Selected",
        text: "The structured study plan and daily practice sessions made all the difference. Highly recommend SRAJ Classes for railway exams.",
        rating: 5
    },
    {
        name: "Sneha Gupta",
        role: "SSI Selected",
        text: "Excellent faculty, updated study material, and a supportive environment. SRAJ Classes is the best coaching in Patna for competitive exams.",
        rating: 5
    }
];

const stats = [
    { label: "Students Placed", value: "5,000+", icon: Users },
    { label: "Expert Faculty", value: "15+", icon: Award },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
    { label: "Active Support", value: "24/7", icon: Clock },
];

const whyUsItems = [
    {
        title: "Personalized Mentorship",
        desc: "One-on-one attention tailored to every student's learning pace and goals.",
        icon: Users
    },
    {
        title: "Smart Test Series",
        desc: "AI-powered exam simulations with deep performance analytics.",
        icon: Zap
    },
    {
        title: "Modern Infrastructure",
        desc: "Digital classrooms with hybrid learning technology and resources.",
        icon: GraduationCap
    },
    {
        title: "Updated Curriculum",
        desc: "Study material refreshed weekly to match the latest exam patterns.",
        icon: BookOpen
    },
];

/* ─── Scroll Reveal Hook ──────────────────────────────── */
function useReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible');
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

function Reveal({ children, className = 'reveal', delay = '' }) {
    const ref = useReveal();
    return (
        <div ref={ref} className={`${className} ${delay}`}>
            {children}
        </div>
    );
}

/* ─── Counter Animation ───────────────────────────────── */
function AnimatedCounter({ value }) {
    const [display, setDisplay] = useState(value);
    const ref = useRef(null);
    const counted = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !counted.current) {
                counted.current = true;
                const numericMatch = value.match(/[\d,]+/);
                if (!numericMatch) return;
                const target = parseInt(numericMatch[0].replace(/,/g, ''), 10);
                const prefix = value.slice(0, value.indexOf(numericMatch[0]));
                const suffix = value.slice(value.indexOf(numericMatch[0]) + numericMatch[0].length);
                const duration = 2000;
                const startTime = performance.now();

                function update(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    setDisplay(`${prefix}${current.toLocaleString()}${suffix}`);
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
            }
        }, { threshold: 0.3 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [value]);

    return <span ref={ref} className="count-up">{display}</span>;
}

/* ─── Main Page ───────────────────────────────────────── */
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
        <div className="min-h-screen bg-background mesh-gradient selection:bg-primary/20 selection:text-primary">
            <LandingNavbar />

            {/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section className="relative pt-36 pb-20 lg:pt-52 lg:pb-36 overflow-hidden">
                {/* Decorative orbs */}
                <div className="hero-orb hero-orb-1" />
                <div className="hero-orb hero-orb-2" />
                <div className="hero-orb hero-orb-3" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <Reveal>
                            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-semibold tracking-wide mb-8 badge-shimmer">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Admissions Open for 2026 Batch
                            </div>
                        </Reveal>

                        {/* Headline */}
                        <Reveal className="reveal delay-100">
                            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold tracking-tight mb-6 leading-[1.05]">
                                Your Future Starts at{' '}
                                <span className="text-gradient">SRAJ Classes</span>
                            </h1>
                        </Reveal>

                        {/* Subtitle */}
                        <Reveal className="reveal delay-200">
                            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                                Transform your aspirations into achievements with expert coaching
                                for <span className="text-foreground font-semibold">SSC, Banking, Railways</span> and
                                other competitive examinations.
                            </p>
                        </Reveal>

                        {/* CTAs */}
                        <Reveal className="reveal delay-300">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => setIsEnrollOpen(true)}
                                    className="group inline-flex items-center justify-center gap-3 px-8 h-14 rounded-xl text-base font-bold w-full sm:w-auto cursor-pointer btn-primary shadow-xl shadow-primary/20"
                                >
                                    <span className="relative z-10">Enroll Now</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                </button>
                                <Link
                                    href="#courses"
                                    className="inline-flex items-center justify-center gap-2 px-8 h-14 rounded-xl text-base font-bold w-full sm:w-auto border border-border hover:border-primary/30 hover:bg-primary/5 text-foreground transition-all"
                                >
                                    View Courses
                                </Link>
                            </div>
                        </Reveal>

                        {/* Trust indicators */}
                        <Reveal className="reveal delay-400">
                            <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span>5,000+ Students Placed</span>
                                </div>
                                <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span>98% Success Rate</span>
                                </div>
                                <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span>15+ Expert Faculty</span>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ━━━ STATS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section className="py-16 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <Reveal key={i} className={`reveal delay-${(i + 1) * 100}`}>
                                <div className="stat-card group">
                                    <div className="mb-3 inline-flex p-2.5 rounded-xl bg-primary/8 text-primary group-hover:bg-primary/15 transition-all">
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-extrabold mb-1.5 tracking-tight text-foreground">
                                        <AnimatedCounter value={stat.value} />
                                    </h3>
                                    <p className="text-xs font-medium text-muted-foreground tracking-wide">{stat.label}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-5xl mx-auto section-divider" />

            {/* ━━━ COURSES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section id="courses" className="py-24 md:py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Reveal>
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Our Programs</p>
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
                                Specialized Coaching <span className="text-gradient">Batches</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Structured programs designed to maximize your potential and deliver consistent results.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course, index) => (
                            <Reveal key={index} className={`reveal delay-${(index + 1) * 100}`}>
                                <div
                                    className="course-card h-full flex flex-col"
                                    style={{ '--card-gradient': `linear-gradient(90deg, ${course.accent}, ${course.accent}aa)` }}
                                >
                                    <div className={`inline-flex p-3.5 rounded-xl bg-gradient-to-br ${course.gradient} shadow-lg mb-5 w-fit`}>
                                        <course.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-primary/8 text-primary rounded-full w-fit mb-3">
                                        {course.tag}
                                    </span>
                                    <h3 className="text-xl font-extrabold mb-3 tracking-tight text-foreground">{course.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                                        {course.description}
                                    </p>
                                    <div className="mt-5 pt-4 border-t border-border/50">
                                        <button
                                            onClick={() => setIsEnrollOpen(true)}
                                            className="text-sm font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
                                        >
                                            Learn more
                                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ WHY US ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section id="about" className="py-24 md:py-32 overflow-hidden relative">
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="flex-1 space-y-10">
                            <Reveal className="reveal-left">
                                <div>
                                    <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Why SRAJ?</p>
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5">
                                        Where Winners Are <span className="text-gradient">Made</span>
                                    </h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                                        We combine expert faculty, modern technology, and personalized attention to deliver unmatched results.
                                    </p>
                                </div>
                            </Reveal>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {whyUsItems.map((item, i) => (
                                    <Reveal key={i} className={`reveal delay-${(i + 1) * 100}`}>
                                        <div className="flex gap-4 group">
                                            <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[15px] mb-1 text-foreground">{item.title}</h4>
                                                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>

                        <Reveal className="reveal-right flex-1 w-full max-w-[480px]">
                            <div className="relative">
                                {/* Background glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-violet-500/15 rounded-3xl blur-3xl" />

                                <div className="relative bg-card border border-border rounded-3xl p-10 md:p-12">
                                    {/* Floating badge */}
                                    <div className="absolute -top-5 -right-5 md:-top-6 md:-right-6">
                                        <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-xl rotate-6 hover:rotate-0 transition-transform duration-500">
                                            <Award className="h-8 w-8 text-white" />
                                        </div>
                                    </div>

                                    <div className="text-center space-y-6">
                                        <Sparkles className="h-8 w-8 text-primary mx-auto" />
                                        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                            India's Leading <span className="text-gradient">Institute</span>
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Join the league of extraordinary achievers. Our proven methodology has produced thousands of successful candidates.
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                                            {["SSC Expert", "Banking Guru", "RLY Specialist"].map(tag => (
                                                <span key={tag} className="px-4 py-2 bg-muted border border-border rounded-full text-xs font-semibold text-muted-foreground">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setIsEnrollOpen(true)}
                                            className="btn-primary mt-4 px-8 py-3.5 rounded-xl text-sm font-bold cursor-pointer w-full sm:w-auto"
                                        >
                                            <span className="relative z-10">Start Your Journey</span>
                                            <ArrowRight className="h-4 w-4 ml-2 relative z-10" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ━━━ TESTIMONIALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section className="py-24 md:py-32 relative bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Reveal>
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Success Stories</p>
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
                                What Our <span className="text-gradient">Students Say</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Real results from real students who trusted us with their preparation.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {testimonials.map((t, i) => (
                            <Reveal key={i} className={`reveal delay-${(i + 1) * 100}`}>
                                <div className="testimonial-card h-full flex flex-col">
                                    <Quote className="h-6 w-6 text-primary/30 mb-4" />
                                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                                        "{t.text}"
                                    </p>
                                    <div className="flex items-center gap-1 mb-3">
                                        {Array.from({ length: t.rating }).map((_, j) => (
                                            <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{t.name}</p>
                                        <p className="text-xs text-primary font-medium">{t.role}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ CONTACT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Reveal>
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Get In Touch</p>
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
                                Let's Start Your <span className="text-gradient">Journey</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Have questions? We're here to help you navigate your path to a successful career.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid lg:grid-cols-5 gap-12 items-start">
                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-4">
                            <Reveal className="reveal-left">
                                <div className="contact-info-card group cursor-pointer">
                                    <div className="h-11 w-11 rounded-xl bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Email</p>
                                        <p className="text-sm font-bold text-foreground">srajgs2025@gmail.com</p>
                                    </div>
                                </div>
                            </Reveal>
                            <Reveal className="reveal-left delay-100">
                                <div className="contact-info-card group cursor-pointer">
                                    <div className="h-11 w-11 rounded-xl bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Phone</p>
                                        <p className="text-sm font-bold text-foreground">+91 91556 91893</p>
                                    </div>
                                </div>
                            </Reveal>
                            <Reveal className="reveal-left delay-200">
                                <div className="contact-info-card group cursor-pointer">
                                    <div className="h-11 w-11 rounded-xl bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Location</p>
                                        <p className="text-sm font-bold text-foreground">Patna, Bihar, India</p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>

                        {/* Contact Form */}
                        <Reveal className="reveal-right lg:col-span-3">
                            <div className="bg-card border border-border p-8 md:p-10 rounded-2xl shadow-sm">
                                <form onSubmit={handleContactSubmit} className="space-y-5">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground ml-0.5">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={contactForm.name}
                                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                                className="w-full bg-muted/40 border border-input rounded-xl px-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground/50"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground ml-0.5">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={contactForm.phone}
                                                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                                className="w-full bg-muted/40 border border-input rounded-xl px-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground/50"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground ml-0.5">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                            className="w-full bg-muted/40 border border-input rounded-xl px-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground/50"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground ml-0.5">Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                            className="w-full bg-muted/40 border border-input rounded-xl px-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground/50 resize-none"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full btn-primary py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-primary/15 disabled:opacity-50 group hover:scale-[1.01] transition-all cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                                                <span className="relative z-10">Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="relative z-10">Send Message</span>
                                                <Send className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform relative z-10" />
                                            </>
                                        )}
                                    </button>

                                    {submitStatus === 'success' && (
                                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 font-semibold text-sm text-center flex items-center justify-center gap-2">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Message sent! We'll get back to you shortly.
                                        </div>
                                    )}
                                    {submitStatus === 'error' && (
                                        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 font-semibold text-sm text-center">
                                            Failed to send message. Please try again.
                                        </div>
                                    )}
                                </form>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            <EnrollmentModal isOpen={isEnrollOpen} onClose={() => setIsEnrollOpen(false)} />

            {/* ━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <footer className="footer-gradient text-white relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* CTA strip */}
                    <div className="py-16 border-b border-white/5">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                                    Ready to Begin?
                                </h3>
                                <p className="text-white/50 text-sm">
                                    Take the first step towards your dream government job.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsEnrollOpen(true)}
                                className="btn-primary px-8 py-3.5 rounded-xl text-sm font-bold cursor-pointer shadow-lg shadow-primary/30 flex-shrink-0"
                            >
                                <span className="relative z-10">Enroll Now</span>
                                <ArrowRight className="h-4 w-4 ml-2 relative z-10" />
                            </button>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-2 space-y-5">
                            <Link href="/" className="flex items-center gap-2.5 group">
                                <div className="p-2 bg-primary/20 rounded-xl">
                                    <GraduationCap className="h-8 w-8 text-primary" />
                                </div>
                                <span className="text-2xl font-extrabold tracking-tight">
                                    SRAJ <span className="text-primary">CLASSES</span>
                                </span>
                            </Link>
                            <p className="text-white/35 text-sm leading-relaxed max-w-sm">
                                Empowering the next generation of government officers with quality education, expert mentorship, and a community of achievers.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6">Explore</h4>
                            <ul className="space-y-3.5 text-white/45 text-sm font-medium">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link href="#courses" className="hover:text-white transition-colors">Courses</Link></li>
                                <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
                                <li><Link href="/login" className="hover:text-white transition-colors">Admin Login</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6">Contact</h4>
                            <ul className="space-y-3.5 text-white/45 text-sm font-medium">
                                <li className="flex items-center gap-2.5">
                                    <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                    Patna, Bihar, India
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                    srajgs2025@gmail.com
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <Phone className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                    +91 91556 91893
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="py-6 border-t border-white/5 text-center text-white/20 text-xs font-medium tracking-wide">
                        © 2026 SRAJ Classes. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
