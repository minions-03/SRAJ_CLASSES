'use client';

import React, { useState, useRef, useCallback } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    Search,
    CreditCard,
    Save,
    Loader2,
    Plus,
    Trash2,
    BookOpen,
    Library,
    GraduationCap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

let nextId = 1;
const makeRow = () => ({ id: nextId++, type: '', amount: '' });

export default function BillingPage() {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searching, setSearching] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feeRows, setFeeRows] = useState([
        { id: nextId++, type: '', amount: '' }
    ]);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [paymentMonth, setPaymentMonth] = useState('');
    const [remarks, setRemarks] = useState('');
    const debounceTimer = useRef(null);

    // ── Fix Hydration: Set date only on client ──────────────────
    React.useEffect(() => {
        setPaymentMonth(new Date().toLocaleString('en-IN', { month: 'long' }));
    }, []);

    // ── Student search ──────────────────────────────────────────
    const searchStudents = useCallback(async (query) => {
        if (query.length < 2) { setStudents([]); setSearching(false); return; }
        setSearching(true);
        try {
            const res = await fetch(`/api/students?search=${encodeURIComponent(query)}&limit=10`);
            const json = await res.json();
            if (json.success) setStudents(json.data);
        } catch (err) {
            console.error('Student search failed:', err);
        } finally {
            setSearching(false);
        }
    }, []);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => searchStudents(val), 350);
    };

    // ── Fee rows helpers ────────────────────────────────────────
    const addFeeRow = () => setFeeRows(r => [...r, makeRow()]);
    const removeFeeRow = (id) => setFeeRows(r => r.filter(row => row.id !== id));
    const updateRow = (id, field, value) =>
        setFeeRows(r => r.map(row => row.id === id ? { ...row, [field]: value } : row));

    const total = feeRows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);

    // ── Submit ──────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudent || total <= 0) return;
        setSubmitting(true);

        const validRows = feeRows.filter(r => parseFloat(r.amount) > 0);
        const isCombined = validRows.length > 1;
        const feeType = isCombined ? 'Combined' : validRows[0]?.type;

        try {
            const res = await fetch('/api/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: selectedStudent._id,
                    amount: total,
                    paymentMethod,
                    paymentMonth,
                    remarks,
                    feeType,
                    feeBreakdown: validRows.map(r => ({ label: r.type, amount: parseFloat(r.amount) })),
                }),
            });
            const json = await res.json();
            if (json.success) router.push(`/billing/${json.data._id}`);
        } catch (err) {
            console.error('Payment failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Collect Fee</h1>
                    <p className="text-muted-foreground mt-1">Search for a student, add fee items, and record the payment.</p>
                </div>

                <div className="glass-card p-8">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-8 text-primary">
                        <CreditCard className="h-6 w-6" />
                        New Transaction
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* ── Step 1: Select Student ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                    1. Select Student *
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Type 2+ characters to search…"
                                        className="input-field w-full pl-10 h-12 text-lg"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                    {searching && (
                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>

                                {searchTerm.length >= 2 && (
                                    <div className="mt-2 max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-2xl z-20 relative">
                                        {searching ? (
                                            <div className="px-5 py-4 text-sm text-slate-500 italic text-center flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" /> Searching…
                                            </div>
                                        ) : students.length > 0 ? (
                                            students.map(s => (
                                                <button
                                                    key={s._id}
                                                    type="button"
                                                    onClick={() => { setSelectedStudent(s); setSearchTerm(''); setStudents([]); }}
                                                    className="w-full text-left px-5 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                                                >
                                                    <div className="font-bold text-slate-900 dark:text-slate-50 text-base">{s.name}</div>
                                                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{s.rollNumber} • {s.course}</div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-5 py-4 text-sm text-slate-500 italic text-center">No results found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="min-h-[100px] flex items-center">
                                {selectedStudent ? (
                                    <div className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-1">Selected Student</p>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">{selectedStudent.name}</h3>
                                                <p className="text-sm text-slate-700 dark:text-slate-400 mt-1 font-medium">{selectedStudent.rollNumber} • {selectedStudent.course}</p>
                                            </div>
                                            <button type="button" onClick={() => setSelectedStudent(null)}
                                                className="px-2 py-1 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                CHANGE
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center p-6 text-slate-400 italic text-sm text-center">
                                        Search and select a student to enable payment options.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Step 2: Fee Items ── */}
                        {selectedStudent && (
                            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-500">

                                <div className="space-y-3">
                                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                        2. Fee Items *
                                    </label>

                                    <div className="space-y-3">
                                        {feeRows.map((row, idx) => (
                                            <div
                                                key={row.id}
                                                className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 border-border bg-white dark:bg-slate-900"
                                            >
                                                {/* Row number */}
                                                <span className="text-xs font-black text-muted-foreground w-5 text-center shrink-0">
                                                    {idx + 1}
                                                </span>

                                                {/* Fee Description Input */}
                                                <div className="relative flex-1 min-w-[200px]">
                                                    <input
                                                        type="text"
                                                        placeholder="Fee description (e.g. Tuition Fees)"
                                                        className="input-field w-full h-11 text-sm font-semibold pr-4"
                                                        value={row.type}
                                                        onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                                                    />
                                                </div>

                                                {/* Amount */}
                                                <div className="relative w-44 shrink-0">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-primary">₹</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="0.00"
                                                        className="input-field w-full pl-8 h-11 text-base font-bold"
                                                        value={row.amount}
                                                        onChange={(e) => updateRow(row.id, 'amount', e.target.value)}
                                                    />
                                                </div>

                                                {/* Remove */}
                                                {feeRows.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFeeRow(row.id)}
                                                        className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0"
                                                        title="Remove"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Fee Button */}
                                    <div className="flex">
                                        <button
                                            type="button"
                                            onClick={addFeeRow}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-primary/40 text-primary font-semibold text-sm hover:border-primary hover:bg-primary/5 transition-all duration-200"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Another Row
                                        </button>
                                    </div>

                                    {/* Total */}
                                    {total > 0 && (
                                        <div className="flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">Total Payable</p>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                                                    {feeRows.filter(r => parseFloat(r.amount) > 0).map(r => r.type || 'Unnamed Fee').join(' + ')}
                                                </p>
                                            </div>
                                            <span className="text-3xl font-black text-slate-900 dark:text-white">₹{total.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                {/* ── Step 3: Payment Details ── */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500">3. Payment Details</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Payment Month *</label>
                                            <select
                                                className="input-field w-full bg-background h-14 cursor-pointer text-lg font-medium"
                                                value={paymentMonth}
                                                onChange={(e) => setPaymentMonth(e.target.value)}
                                            >
                                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                                    <option key={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Payment Method</label>
                                            <select
                                                className="input-field w-full bg-background h-14 cursor-pointer text-lg font-medium"
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            >
                                                <option value="Cash">💵 Cash</option>
                                                <option value="UPI">📱 UPI (Paytm / GPay)</option>
                                                <option value="Bank Transfer">🏦 Bank Transfer</option>
                                                <option value="Cheque">📄 Cheque</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-medium">Remarks / Description (optional)</label>
                                            <textarea
                                                className="input-field w-full min-h-[80px] py-3 text-base"
                                                placeholder="e.g. Monthly installment, First-term admission…"
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Submit ── */}
                                <button
                                    type="submit"
                                    disabled={submitting || total <= 0}
                                    className="btn-primary w-full h-16 text-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-1"
                                >
                                    {submitting
                                        ? <><Loader2 className="h-6 w-6 animate-spin" /> Processing…</>
                                        : <><Save className="h-6 w-6" /> Finalize Payment — ₹{total.toLocaleString()}</>
                                    }
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
