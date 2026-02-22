'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
    Loader2,
    X,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const LIMIT = 10;

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');   // what user is typing
    const [appliedSearch, setAppliedSearch] = useState(''); // what we actually query
    const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

    // Fetch whenever page or applied search changes
    const fetchStudents = useCallback(async (page, search) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: LIMIT });
            if (search) params.set('search', search);
            const res = await fetch(`/api/students?${params}`);
            const json = await res.json();
            if (json.success) {
                setStudents(json.data);
                setPagination(json.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudents(pagination.page, appliedSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, appliedSearch]);

    // Trigger search only on Enter key; auto-reset when input is cleared
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            setAppliedSearch(searchInput.trim());
            setPagination((prev) => ({ ...prev, page: 1 }));
        }
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchInput(val);
        if (val === '') {
            setAppliedSearch('');
            setPagination((prev) => ({ ...prev, page: 1 }));
        }
    };

    // Clear search
    const clearSearch = () => {
        setSearchInput('');
        setAppliedSearch('');
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const goToPage = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

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
                            placeholder="Search by name, roll number, or course… then press Enter"
                            className="input-field w-full pl-10 pr-10"
                            value={searchInput}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                        />
                        {searchInput && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                title="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </button>
                </div>

                {/* Applied search badge */}
                {appliedSearch && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Showing results for:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            &ldquo;{appliedSearch}&rdquo;
                            <button onClick={clearSearch} className="ml-1 hover:text-primary/60">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                        <span className="text-xs">({pagination.total} results)</span>
                    </div>
                )}

                {/* Students Table */}
                <div className="glass-card overflow-hidden">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
                            <Loader2 className="h-10 w-10 animate-spin mb-4" />
                            <p>Loading students data...</p>
                        </div>
                    ) : students.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 border-b border-border/50">
                                    <tr className="text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-wider">
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
                                    {students.map((student) => (
                                        <tr key={student._id} className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-blue-600 dark:text-blue-400 font-bold">{student.rollNumber}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-black text-slate-900 dark:text-slate-100">{student.name}</div>
                                                <div className="text-xs text-slate-700 dark:text-slate-400 font-bold">{student.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-slate-200">{student.course}</td>
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
                            <p className="text-sm">
                                {appliedSearch
                                    ? `No results for "${appliedSearch}". Try a different search.`
                                    : 'Try adjusting your search or add a new student.'}
                            </p>
                            {!appliedSearch && (
                                <Link href="/students/add" className="btn-primary mt-6">Enroll New Student</Link>
                            )}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {!loading && pagination.totalPages > 0 && (
                        <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between flex-wrap gap-3">
                            <p className="text-sm text-muted-foreground">
                                Page <span className="font-semibold">{pagination.page}</span> of{' '}
                                <span className="font-semibold">{pagination.totalPages}</span>
                                <span className="ml-2 text-xs">({pagination.total} total students)</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                                    onClick={() => goToPage(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    title="Previous page"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                {/* Page number pills */}
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                    .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
                                    .reduce((acc, p, idx, arr) => {
                                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((item, idx) =>
                                        item === '...' ? (
                                            <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground text-sm">…</span>
                                        ) : (
                                            <button
                                                key={item}
                                                onClick={() => goToPage(item)}
                                                className={cn(
                                                    "w-8 h-8 rounded-lg text-sm font-medium border transition-colors",
                                                    item === pagination.page
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "border-border hover:bg-muted"
                                                )}
                                            >
                                                {item}
                                            </button>
                                        )
                                    )}

                                <button
                                    className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                                    onClick={() => goToPage(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    title="Next page"
                                >
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
