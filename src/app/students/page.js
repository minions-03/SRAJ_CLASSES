'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    Users,
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch('/api/students');
            const json = await res.json();
            if (json.success) {
                setStudents(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Students Directory</h1>
                        <p className="text-muted-foreground mt-1">Manage and track all enrolled students in SRAJ Classes.</p>
                    </div>
                    <Link href="/students/add" className="btn-primary flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Enroll New Student
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, roll number, or course..."
                            className="input-field w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </button>
                </div>

                {/* Students Table */}
                <div className="glass-card overflow-hidden">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
                            <Loader2 className="h-10 w-10 animate-spin mb-4" />
                            <p>Loading students data...</p>
                        </div>
                    ) : filteredStudents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 border-b border-border/50">
                                    <tr className="text-muted-foreground text-sm">
                                        <th className="px-6 py-4 font-medium">Roll No</th>
                                        <th className="px-6 py-4 font-medium">Student Name</th>
                                        <th className="px-6 py-4 font-medium">Course</th>
                                        <th className="px-6 py-4 font-medium">Total Fees</th>
                                        <th className="px-6 py-4 font-medium">Paid</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-primary font-medium">{student.rollNumber}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold">{student.name}</div>
                                                <div className="text-xs text-muted-foreground">{student.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{student.course}</td>
                                            <td className="px-6 py-4 text-sm font-medium">₹{student.totalFees.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                                                    <div
                                                        className="bg-green-500 h-full rounded-full"
                                                        style={{ width: `${Math.min((student.paidFees / student.totalFees) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <div className="text-[10px] font-medium text-muted-foreground">
                                                    ₹{student.paidFees.toLocaleString()} paid
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                                    student.status === 'Active' ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                                                )}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 rounded-lg hover:bg-muted text-blue-500" title="Edit">
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-2 rounded-lg hover:bg-muted text-red-500" title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-2 rounded-lg hover:bg-muted" title="Options">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
                            <Users className="h-16 w-16 mb-4 opacity-20" />
                            <p className="text-xl font-medium">No students found</p>
                            <p className="text-sm">Try adjusting your search or add a new student.</p>
                            <Link href="/students/add" className="btn-primary mt-6">Enroll New Student</Link>
                        </div>
                    )}

                    {/* Pagination Placeholder */}
                    {!loading && filteredStudents.length > 0 && (
                        <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing <span className="font-medium">{filteredStudents.length}</span> students
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50" disabled>
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50" disabled>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
