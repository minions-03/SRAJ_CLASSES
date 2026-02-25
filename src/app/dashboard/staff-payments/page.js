'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Wallet, Plus, Save, Loader2, Calendar, User, IndianRupee, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function StaffPaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        teacherName: '',
        amount: '',
        month: '',
        date: new Date().toISOString().split('T')[0],
        remarks: ''
    });

    useEffect(() => {
        fetchPayments();
        const currentMonth = new Date().toLocaleString('en-IN', { month: 'long' });
        setFormData(prev => ({ ...prev, month: currentMonth }));
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await fetch('/api/staff-payments');
            const json = await res.json();
            if (json.success) setPayments(json.data);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/staff-payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const json = await res.json();
            if (json.success) {
                toast.success('Payment recorded successfully!');
                setPayments([json.data, ...payments]);
                setShowForm(false);
                setFormData({
                    teacherName: '',
                    amount: '',
                    month: new Date().toLocaleString('en-IN', { month: 'long' }),
                    date: new Date().toISOString().split('T')[0],
                    remarks: ''
                });
            } else {
                toast.error(json.error || 'Failed to record payment');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Staff Payments</h1>
                        <p className="text-muted-foreground mt-1">Record and manage teacher salary and staff payments.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary flex items-center gap-2"
                    >
                        {showForm ? <Trash2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {showForm ? 'Cancel' : 'Add Payment'}
                    </button>
                </div>

                {showForm && (
                    <div className="glass-card p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-primary">
                            <Wallet className="h-6 w-6" />
                            Record New Payment
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <User className="h-3 w-3" /> Teacher Name *
                                </label>
                                <input
                                    type="text"
                                    name="teacherName"
                                    required
                                    value={formData.teacherName}
                                    onChange={handleInputChange}
                                    placeholder="Enter teacher's full name"
                                    className="input-field w-full h-12 text-sm font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <IndianRupee className="h-3 w-3" /> Amount *
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    required
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="input-field w-full h-12 text-sm font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <Calendar className="h-3 w-3" /> Payment Month *
                                </label>
                                <select
                                    name="month"
                                    required
                                    value={formData.month}
                                    onChange={handleInputChange}
                                    className="input-field w-full h-12 text-sm font-bold bg-white dark:bg-slate-900"
                                >
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <Calendar className="h-3 w-3" /> Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="input-field w-full h-12 text-sm font-bold"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Remarks (Optional)</label>
                                <input
                                    type="text"
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                    placeholder="Add any extra details..."
                                    className="input-field w-full h-12 text-sm font-medium"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary h-12 px-8 flex items-center gap-2 text-sm font-black uppercase tracking-widest"
                                >
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save Payment Record
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-slate-50/50 dark:bg-white/5">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Teacher Name</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Month</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                            <p className="mt-2 text-sm font-bold text-muted-foreground">Loading payments...</p>
                                        </td>
                                    </tr>
                                ) : payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <p className="text-sm font-bold text-muted-foreground italic">No payment records found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((p) => (
                                        <tr key={p._id} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-500">
                                                {new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                                                {p.teacherName}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-primary/10 text-primary border border-primary/20">
                                                    {p.month}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-black text-lg text-slate-900 dark:text-white">
                                                ₹{p.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 font-medium italic">
                                                {p.remarks || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
