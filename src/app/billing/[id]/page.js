'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft, Loader2, Download } from 'lucide-react';

export default function InvoiceDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await fetch(`/api/billing/${id}`);
                const json = await res.json();
                if (json.success) {
                    setInvoice(json.data);
                }
            } catch (error) {
                console.error('Failed to fetch invoice:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchInvoice();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <p className="text-xl font-medium">Invoice not found</p>
                <button onClick={() => router.back()} className="btn-secondary">Go Back</button>
            </div>
        );
    }

    const student = invoice.studentId;

    return (
        <div className="min-h-screen bg-white text-slate-900 p-4 md:p-10">
            {/* Action Bar - Hidden during print */}
            <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between print:hidden">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Billing
                </button>
                <div className="flex gap-3">
                    <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
                        <Printer className="h-4 w-4" /> Print Receipt
                    </button>
                </div>
            </div>

            {/* Invoice Template */}
            <div className="max-w-3xl mx-auto border border-slate-200 shadow-sm p-8 md:p-12 bg-white printable-content">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-600 tracking-tight">SRAJ</h1>
                        <p className="text-lg font-semibold text-slate-800">Competitive Classes</p>
                        <p className="text-xs text-slate-500 mt-2 max-w-[200px]">
                            Quality Education for Competitive Exams. SSC, Banking, Railway & More.
                        </p>
                        <div className="mt-3 space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 leading-none tracking-tight">Email: Srajgs2025@gmail.com</p>
                            <p className="text-[10px] font-bold text-slate-400 leading-none tracking-tight">Call: +91 91556 91893</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold uppercase tracking-wider text-slate-400">Fee Receipt</h2>
                        <p className="text-sm font-medium mt-1">No: <span className="font-mono text-slate-900">{invoice.invoiceNumber}</span></p>
                        <p className="text-sm text-slate-500 mt-1">Date: {new Date(invoice.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Student Details</p>
                        <p className="font-bold text-lg">{student?.name}</p>
                        <p className="text-sm text-slate-600">ID: {student?.rollNumber}</p>
                        <p className="text-sm text-slate-600">Course: {student?.course}</p>
                        <p className="text-sm text-slate-600">Phone: {student?.phone}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Payment Info</p>
                        <p className="text-sm text-slate-600">Month: <span className="font-bold text-slate-900">{invoice.paymentMonth}</span></p>
                        <p className="text-sm text-slate-600">Method: <span className="font-medium text-slate-900">{invoice.paymentMethod}</span></p>
                        {invoice.remarks && <p className="text-sm text-slate-600">Note: {invoice.remarks}</p>}
                    </div>
                </div>

                {/* Table */}
                <div className="w-full mb-10">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-900">
                                <th className="text-left py-3 text-sm font-bold uppercase tracking-wider">Description</th>
                                <th className="text-right py-3 text-sm font-bold uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="py-4 text-sm">Course Fee Payment - {student?.course}</td>
                                <td className="py-4 text-right font-semibold text-slate-900">₹{invoice.amount.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="flex justify-end mb-12">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between items-center py-2 border-t-2 border-slate-900 font-bold text-lg bg-slate-50 px-2">
                            <span>Total Paid</span>
                            <span>₹{invoice.amount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-10 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-wide">
                            <p>Computer Generated Receipt</p>
                            <p>No Signature Required</p>
                            <p>© 2026 SRAJ Competitive Classes</p>
                        </div>
                        <div className="text-right italic text-slate-300 text-xs">
                            Thank you for your trust.
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body {
                        background-color: white !important;
                        -webkit-print-color-adjust: exact;
                    }
                    .printable-content {
                        border: none !important;
                        box-shadow: none !important;
                        padding: 20mm !important;
                    }
                }
            `}</style>
        </div>
    );
}
