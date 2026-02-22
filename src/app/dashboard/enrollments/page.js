'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    UserCheck,
    UserX,
    Clock,
    Loader2,
    RefreshCcw,
    GraduationCap,
    Phone,
    Mail,
    CheckCircle2,
    X
} from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';

export default function EnrollmentsPage() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/enrollments');
            const json = await res.json();
            if (json.success) {
                setEnrollments(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch enrollments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        setProcessingId(id);
        try {
            const res = await fetch('/api/admin/enrollments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            const json = await res.json();
            if (json.success) {
                // Refresh list
                fetchEnrollments();
            } else {
                alert(json.message);
            }
        } catch (error) {
            console.error('Failed to process enrollment:', error);
        } finally {
            setProcessingId(null);
        }
    };

    const filteredEnrollments = enrollments.filter(enrollment =>
        enrollment.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        enrollment.phone.includes(appliedSearch)
    );

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') setAppliedSearch(searchInput.trim());
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchInput(val);
        if (val === '') setAppliedSearch('');
    };

    const clearSearch = () => { setSearchInput(''); setAppliedSearch(''); };

    const pendingCount = enrollments.filter(e => e.status === 'Pending').length;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admission Applications</h1>
                        <p className="text-muted-foreground mt-1">
                            You have <span className="text-primary font-bold">{pendingCount}</span> pending applications to review.
                        </p>
                    </div>
                    <button
                        onClick={fetchEnrollments}
                        className="btn-secondary flex items-center gap-2 text-sm self-start"
                    >
                        <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Stats & Search */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                        <SearchInput
                            value={searchInput}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            onClear={clearSearch}
                            placeholder="Search pending applications by name or phone… then press Enter"
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-bold text-primary uppercase tracking-widest">
                        <Clock className="h-3.5 w-3.5" />
                        {pendingCount} Pending
                    </div>
                </div>

                {appliedSearch && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground -mt-2">
                        <span>Results for:</span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">
                            &ldquo;{appliedSearch}&rdquo;
                            <button onClick={clearSearch} className="ml-1 hover:text-primary/60 transition-colors">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                        <span className="text-xs">({filteredEnrollments.length} found)</span>
                    </div>
                )}

                {loading && enrollments.length === 0 ? (
                    <div className="flex h-[40vh] items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredEnrollments.map((enrollment) => (
                            <div key={enrollment._id} className={`glass-card relative overflow-hidden group transition-all duration-300 ${enrollment.status === 'Pending' ? 'border-l-4 border-primary' : ''}`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-4 rounded-2xl ${enrollment.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                                            enrollment.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                                                'bg-primary/10 text-primary'
                                            }`}>
                                            <GraduationCap className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xl font-bold italic tracking-tight">{enrollment.name}</h3>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${enrollment.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                                                    enrollment.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-primary/10 text-primary'
                                                    }`}>
                                                    {enrollment.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5 font-bold">
                                                    <span className="text-primary uppercase tracking-tighter text-[10px]">Course:</span> {enrollment.course}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="h-3 w-3" /> {enrollment.phone}
                                                </div>
                                                {enrollment.email && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="h-3 w-3" /> {enrollment.email}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3" /> {new Date(enrollment.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {enrollment.status === 'Pending' && (
                                            <>
                                                <button
                                                    disabled={processingId === enrollment._id}
                                                    onClick={() => handleAction(enrollment._id, 'Approved')}
                                                    className="btn-primary px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                                                >
                                                    {processingId === enrollment._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                                                    Approve
                                                </button>
                                                <button
                                                    disabled={processingId === enrollment._id}
                                                    onClick={() => handleAction(enrollment._id, 'Rejected')}
                                                    className="btn-secondary px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:-translate-y-0.5"
                                                >
                                                    <UserX className="h-4 w-4" />
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredEnrollments.length === 0 && (
                            <div className="glass-card py-20 text-center space-y-4">
                                <div className="inline-flex p-4 rounded-full bg-muted/50">
                                    <Clock className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">No applications found</h3>
                                    <p className="text-muted-foreground italic">Waiting for new aspirants to enroll...</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
