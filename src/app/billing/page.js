'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    Search,
    CreditCard,
    Save,
    Loader2,
    User,
    Banknote
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [formData, setFormData] = useState({
        amount: '',
        paymentMethod: 'Cash',
        paymentMonth: new Date().toLocaleString('en-IN', { month: 'long' }),
        remarks: ''
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/students');
            const json = await res.json();
            if (json.success) setStudents(json.data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !formData.amount) return;

        setLoading(true);
        try {
            const res = await fetch('/api/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: selectedStudent._id,
                    amount: Number(formData.amount),
                    paymentMethod: formData.paymentMethod,
                    remarks: formData.remarks
                }),
            });
            const json = await res.json();
            if (json.success) {
                setFormData({
                    amount: '',
                    paymentMethod: 'Cash',
                    paymentMonth: new Date().toLocaleString('en-IN', { month: 'long' }),
                    remarks: ''
                });
                // Redirect to the new invoice for direct printing
                router.push(`/billing/${json.data._id}`);
            }
        } catch (error) {
            console.error('Payment failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Collect Fee</h1>
                    <p className="text-muted-foreground mt-1">Search for a student to record a new fee payment.</p>
                </div>

                <div className="glass-card p-8">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-8 text-primary">
                        <CreditCard className="h-6 w-6" />
                        New Transaction
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Student Search Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">1. Select Student *</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Enter name or Roll Number..."
                                        className="input-field w-full pl-10 h-12 text-lg"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {searchTerm && (
                                    <div className="mt-2 max-h-60 overflow-y-auto border border-border rounded-xl bg-card shadow-xl z-20 relative">
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map(student => (
                                                <button
                                                    key={student._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setSearchTerm('');
                                                    }}
                                                    className="w-full text-left px-5 py-3 hover:bg-primary/5 transition-colors border-b last:border-0 flex justify-between items-center"
                                                >
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                                                        <div className="text-xs text-muted-foreground">{student.rollNumber} • {student.course}</div>
                                                    </div>
                                                    <div className="text-primary opacity-0 group-hover:opacity-100 italic text-[10px]">Select</div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-5 py-4 text-sm text-muted-foreground italic text-center">No results found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="min-h-[100px] flex items-center">
                                {selectedStudent ? (
                                    <div className="w-full p-4 bg-primary/5 border border-primary/20 rounded-xl animate-in fade-in zoom-in-95 duration-300">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Target Account</p>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{selectedStudent.name}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">{selectedStudent.rollNumber} • {selectedStudent.course}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedStudent(null)}
                                                className="p-1 px-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                CHANGE
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center p-6 text-slate-400 italic text-sm text-center">
                                        Search and select a student to enable payment options.
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedStudent && (
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-500">
                                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 block mb-4">2. Payment Details</label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Amount to Pay (₹) *</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-xl">₹</span>
                                            <input
                                                type="number"
                                                required
                                                className="input-field w-full pl-10 h-14 text-2xl font-bold"
                                                placeholder="0.00"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Payment Month *</label>
                                        <select
                                            className="input-field w-full bg-background h-14 cursor-pointer text-lg font-medium"
                                            value={formData.paymentMonth}
                                            onChange={(e) => setFormData({ ...formData, paymentMonth: e.target.value })}
                                        >
                                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Payment Method</label>
                                        <select
                                            className="input-field w-full bg-background h-14 cursor-pointer text-lg font-medium"
                                            value={formData.paymentMethod}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        >
                                            <option value="Cash">💵 Cash</option>
                                            <option value="UPI">📱 UPI (Paytm/GPay)</option>
                                            <option value="Bank Transfer">🏦 Bank Transfer</option>
                                            <option value="Cheque">📄 Cheque</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium">Remarks / Description</label>
                                        <textarea
                                            className="input-field w-full min-h-[100px] py-3 text-lg"
                                            placeholder="Example: Monthly installment, Admission fee, etc."
                                            value={formData.remarks}
                                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary w-full h-16 text-xl font-bold flex items-center justify-center gap-3 mt-8 shadow-xl shadow-primary/20"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                                    Finalize Payment & Generate Receipt
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
