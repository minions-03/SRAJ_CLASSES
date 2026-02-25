'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InvoicesTab({ studentId }) {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await fetch('/api/student/invoices');
                const data = await res.json();
                if (data.success) {
                    setInvoices(data.invoices);
                } else {
                    setError('Failed to load invoices');
                }
            } catch (err) {
                setError('An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-500 text-sm">Loading invoices...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600 font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8 transition-colors">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Payment History</h3>

            {invoices.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 transition-colors">
                    <p className="text-slate-500 dark:text-slate-400">No invoices found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoice #</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Month</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
                            {invoices.map((invoice) => (
                                <tr key={invoice._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group">
                                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {formatDate(invoice.paymentDate)}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {invoice.invoiceNumber}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {invoice.paymentMonth}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                                        ₹{invoice.amount}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Link
                                            href={`/billing/${invoice._id}`}
                                            target="_blank"
                                            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 012-2H5a2 2 0 012 2v4a2 2 0 002 2m2-2v2m0-6h.01"></path>
                                            </svg>
                                            View / Print
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
