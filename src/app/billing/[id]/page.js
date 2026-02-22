'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';

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

    // Ensure we show a breakdown, or the single fee type
    const displayItems = invoice.feeBreakdown && invoice.feeBreakdown.length > 0
        ? invoice.feeBreakdown
        : [{ label: invoice.feeType || 'Tuition Fees', amount: invoice.amount }];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-10">
            {/* Action Bar - Hidden during print */}
            <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to History
                </button>
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
                >
                    <Printer className="h-4 w-4" /> Print Receipt
                </button>
            </div>

            {/* Invoice Container - Styled like a real paper sheet */}
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-16 printable-content border border-slate-200">

                {/* Header (Branding as it is) */}
                <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
                    <div>
                        <h1 className="text-4xl font-black text-blue-600 tracking-tighter mb-1">SRAJ</h1>
                        <p className="text-lg font-bold text-slate-800 tracking-tight uppercase">Competitive Classes</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">
                            Quality Education for Competitive Exams.<br />
                            SSC • BANKING • RAILWAY • POLICE • GD
                        </p>
                        <div className="mt-4 space-y-0.5 text-[10px] font-bold text-slate-500 uppercase">
                            <p>Email: Srajgs2025@gmail.com</p>
                            <p>Call: +91 91556 91893</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="mb-4">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Fee Receipt</h2>
                        </div>
                        <p className="text-sm font-bold text-slate-900">No: {invoice.invoiceNumber}</p>
                        <p className="text-xs text-slate-500 font-medium">Date: {new Date(invoice.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    </div>
                </div>

                {/* Section Breakdown (Matching the sketch) */}
                <div className="mb-10 flex justify-between items-start">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold border-b border-slate-900 pb-0.5 inline-block">Student details</h3>
                        <div className="space-y-1.5 text-sm font-semibold text-slate-700">
                            <p className="flex gap-2"><span>Name:</span> <span className="text-slate-900">{student?.name}</span></p>
                            <p className="flex gap-2"><span>Student ID:</span> <span className="text-slate-900">{student?.studentId}</span></p>
                            <p className="flex gap-2"><span>Course:</span> <span className="text-slate-900">{student?.course}</span></p>
                            <p className="flex gap-2"><span>Phone No.:</span> <span className="text-slate-900">{student?.phone}</span></p>
                            <p className="flex gap-2"><span>Email:</span> <span className="text-slate-900 lowercase font-normal">{student?.email || 'N/A'}</span></p>
                        </div>
                    </div>
                    <div className="text-right space-y-1.5 pt-8 text-sm font-semibold">
                        <p className="flex gap-3 justify-end"><span>Month:</span> <span className="text-slate-900 underline underline-offset-4">{invoice.paymentMonth}</span></p>
                        <p className="flex gap-3 justify-end"><span>Method:</span> <span className="text-slate-900 underline underline-offset-4">{invoice.paymentMethod}</span></p>
                    </div>
                </div>

                {/* Main Content Area (Divider) */}
                <div className="h-px bg-slate-900 w-full mb-8"></div>

                {/* Table Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Description</h3>
                    <h3 className="text-lg font-bold">Amount</h3>
                </div>

                {/* Items Separator */}
                <div className="h-px bg-slate-300 w-full mb-6"></div>

                {/* Items */}
                <div className="space-y-6 mb-12 min-h-[150px]">
                    {displayItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-base font-medium text-slate-800">
                            <p className="capitalize">{item.label.toLowerCase()}</p>
                            <p className="font-bold text-lg">₹{item.amount.toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                {/* Footer Separator */}
                <div className="h-px bg-slate-300 w-full mb-6"></div>

                {/* Total Section */}
                <div className="flex justify-end pr-2">
                    <div className="text-right border-t-2 border-slate-900 pt-4 w-64">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-bold">Total Amount</span>
                            <span className="text-2xl font-black text-slate-950">₹{invoice.amount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Print Only Disclaimer */}
                <div className="mt-32 pt-10 border-t border-slate-50 opacity-50 flex justify-between items-end text-[9px] font-medium uppercase tracking-widest text-slate-300">
                    <p>© 2026 SRAJ COMPETITIVE CLASSES • SYSTEM GENERATED RECEIPT</p>
                    <p className="italic">Quality Education for a Better Future</p>
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
                    }
                    .printable-content {
                        border: none !important;
                        box-shadow: none !important;
                        padding: 10mm !important;
                    }
                    .bg-slate-50 {
                        background-color: white !important;
                    }
                }
            `}</style>
        </div>
    );
}
