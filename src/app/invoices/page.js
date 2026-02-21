'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    History,
    Printer,
    Loader2,
    Search,
    FileText,
    Calendar,
    Download
} from 'lucide-react';
import Link from 'next/link';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/billing');
            const json = await res.json();
            if (json.success) {
                setInvoices(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.studentId?.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by invoice number, student name, or roll number..."
                            className="input-field w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <Calendar className="h-3 w-3" />
                        Total Records: {filteredInvoices.length}
                    </div>
                </div>

                <div className="glass-card p-0 overflow-hidden min-h-[500px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/50 border-b border-border/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                                <tr>
                                    <th className="px-6 py-5">Invoice Details</th>
                                    <th className="px-6 py-5">Student / Course</th>
                                    <th className="px-6 py-5">Month Paid</th>
                                    <th className="px-6 py-5">Payment Method</th>
                                    <th className="px-6 py-5">Amount</th>
                                    <th className="px-6 py-5">Date</th>
                                    <th className="px-6 py-5 text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <p className="text-slate-400 text-sm font-medium">Fetching history...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredInvoices.length > 0 ? (
                                    filteredInvoices.map((inv) => (
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
                                                        <div className="text-[10px] text-muted-foreground mt-0.5">ID: {inv._id.substring(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{inv.studentId?.name || 'Unknown'}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">{inv.studentId?.rollNumber} • {inv.studentId?.course}</div>
                                            </td>
                                            <td className="px-6 py-5 border-l border-slate-50 dark:border-slate-800">
                                                <div className="text-xs font-bold text-primary italic">{inv.paymentMonth}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                                    {inv.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-base font-black text-green-600">₹{inv.amount.toLocaleString()}</div>
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
                                        <td colSpan="6" className="px-6 py-32 text-center text-muted-foreground italic">
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
                </div>
            </div>
        </DashboardLayout>
    );
}
