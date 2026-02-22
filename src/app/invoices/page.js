'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    History,
    Printer,
    Loader2,
    FileText,
    Calendar,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-react';
import Link from 'next/link';
import { SearchInput } from '@/components/SearchInput';
import { cn } from '@/lib/utils';

const LIMIT = 10;

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

    const fetchInvoices = useCallback(async (page, search) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: LIMIT.toString()
            });
            if (search) params.set('search', search);

            const res = await fetch(`/api/billing?${params}`);
            const json = await res.json();
            if (json.success) {
                setInvoices(json.data);
                setPagination(json.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInvoices(pagination.page, appliedSearch);
    }, [pagination.page, appliedSearch, fetchInvoices]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setAppliedSearch(searchInput.trim());
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchInput(val);
        if (val === '') {
            setAppliedSearch('');
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    };

    const clearSearch = () => {
        setSearchInput('');
        setAppliedSearch('');
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const goToPage = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Fee Invoices</h1>
                        <p className="text-muted-foreground mt-1">Manage and print student payment records.</p>
                    </div>
                </div>

                <div className="glass-card flex flex-col md:flex-row md:items-center gap-4 p-4 mb-6">
                    <SearchInput
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        onClear={clearSearch}
                        placeholder="Search by invoice number, student name, or student ID… then press Enter"
                    />
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <Calendar className="h-3 w-3" />
                        Total Records: {pagination.total}
                    </div>
                </div>

                {appliedSearch && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <span>Results for:</span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">
                            &ldquo;{appliedSearch}&rdquo;
                            <button onClick={clearSearch} className="ml-1 hover:text-primary/60 transition-colors">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                        <span className="text-xs">({pagination.total} results)</span>
                    </div>
                )}

                <div className="glass-card p-0 overflow-hidden min-h-[500px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/50 border-b border-border/50 text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-[0.2em]">
                                <tr>
                                    <th className="px-6 py-5">Invoice Details</th>
                                    <th className="px-6 py-5">Student / Course</th>
                                    <th className="px-6 py-5">Fee Type</th>
                                    <th className="px-6 py-5">Month Paid</th>
                                    <th className="px-6 py-5">Method</th>
                                    <th className="px-6 py-5">Amount</th>
                                    <th className="px-6 py-5">Date</th>
                                    <th className="px-6 py-5 text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Fetching history...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : invoices.length > 0 ? (
                                    invoices.map((inv) => (
                                        <tr key={inv._id} className="hover:bg-primary/[0.02] transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-mono text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
                                                            #{inv.invoiceNumber}
                                                        </div>
                                                        <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 font-bold">Ref: {inv._id.substring(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-black text-slate-900 dark:text-slate-200">{inv.studentId?.name || 'Unknown'}</div>
                                                <div className="text-xs text-slate-700 dark:text-slate-400 mt-0.5 font-medium">{inv.studentId?.studentId} • {inv.studentId?.course}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                    ${inv.feeType === 'Tuition Fees' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                        : inv.feeType === 'Library Fees' ? 'bg-purple-500/10 text-purple-600'
                                                            : inv.feeType === 'Admission Fees' ? 'bg-green-500/10 text-green-600'
                                                                : inv.feeType === 'Combined' ? 'bg-orange-500/10 text-orange-600'
                                                                    : 'bg-slate-100 text-slate-500'}`}>
                                                    {inv.feeType || 'Tuition Fees'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-xs font-bold text-primary italic">{inv.paymentMonth}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-[10px] font-black text-slate-900 dark:text-slate-200">
                                                    {inv.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-base font-black text-green-700 dark:text-green-500">₹{inv.amount.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-[11px] font-medium text-slate-500">
                                                    {new Date(inv.paymentDate).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href={`/billing/${inv._id}`}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-xs font-bold transition-all duration-200"
                                                >
                                                    <Printer className="h-3 w-3" /> PRINT
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-32 text-center text-muted-foreground italic">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <History className="h-16 w-16" />
                                                <p className="text-lg">No records match your criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {!loading && pagination.totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between flex-wrap gap-3 bg-muted/20">
                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">
                                Page {pagination.page} of {pagination.totalPages}
                                <span className="ml-3 text-primary opacity-60">({pagination.total} records total)</span>
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    onClick={() => goToPage(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    title="Previous page"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

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
                                                    "w-8 h-8 rounded-lg text-xs font-black transition-all",
                                                    item === pagination.page
                                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-110"
                                                        : "border border-border hover:bg-muted text-slate-700 dark:text-slate-300"
                                                )}
                                            >
                                                {item}
                                            </button>
                                        )
                                    )}

                                <button
                                    className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
