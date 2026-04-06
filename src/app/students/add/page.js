'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    User,
    Phone,
    Mail,
    BookOpen,
    MapPin,
    GraduationCap,
    CreditCard,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function AddStudentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: '',
        address: '',
        status: 'Active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const json = await res.json();
            if (json.success) {
                router.push('/students');
            } else {
                alert('Error: ' + json.error);
            }
        } catch (error) {
            console.error('Submit failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/students" className="p-2 rounded-lg hover:bg-muted transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Enroll Student</h1>
                        <p className="text-muted-foreground">Fill in the details to register a new student for SRAJ Classes.</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="glass-card space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                <User className="h-5 w-5 text-primary" />
                                Personal Information
                            </h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        name="name"
                                        required
                                        className="input-field w-full pl-14"
                                        placeholder="e.g. Rahul Sharma"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">+91 </span>
                                    <input
                                        name="phone"
                                        required
                                        maxLength="10"
                                        className="input-field w-full pl-14"
                                        placeholder=" 00000 00000"
                                        value={formData.phone.replace('+91 ', '')}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setFormData(prev => ({ ...prev, phone: val ? `+91 ${val}` : '' }));
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="input-field w-full pl-14"
                                        placeholder="rahul@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div className="glass-card space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Course & Status
                            </h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Enrolled Course *</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <select
                                        name="course"
                                        required
                                        className="input-field w-full pl-14 appearance-none bg-background cursor-pointer"
                                        value={formData.course}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a course</option>
                                        <option value="SSC CGL">SSC CGL</option>
                                        <option value="Banking">Banking (IBPS/SBI)</option>
                                        <option value="Railway (NTPC/Group D)">Railway (NTPC/Group D)</option>
                                        <option value="SSC CHSL/MTS">SSC CHSL/MTS</option>
                                        <option value="Police Exams">Police Exams</option>
                                        <option value="Library">Library</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Permanent Address *</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                                    <textarea
                                        name="address"
                                        required
                                        className="input-field w-full min-h-[80px] py-3 pl-14"
                                        placeholder="Enter complete address..."
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">System Status</label>
                                <select
                                    name="status"
                                    className="input-field w-full bg-background cursor-pointer"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link href="/students" className="btn-secondary">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn-primary flex items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Student
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
