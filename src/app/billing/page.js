'use client';

import React, { useState, useRef, useCallback } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    CreditCard,
    Save,
    Loader2,
    Plus,
    Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { SearchInput } from '@/components/SearchInput';

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
        if (val === '') {
            setStudents([]);
            setSearching(false);
        } else {
            debounceTimer.current = setTimeout(() => searchStudents(val), 350);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setStudents([]);
        setSearching(false);
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
            if (json.success) {
                toast.success('Payment recorded successfully!');
                router.push(`/billing/${json.data._id}`);
            } else {
                toast.error(json.error || 'Payment failed. Please try again.');
            }
        } catch (err) {
            console.error('Payment failed:', err);
            toast.error('Payment failed. Please try again.');
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
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    1. Select Student *
                                </label>
                                <div className="relative">
                                    <SearchInput
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        onClear={clearSearch}
                                        placeholder="Type 2+ characters to search…"
                                        className="h-14 text-lg !pl-12"
                                    />
                                    {searching && (
                                        <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                                    )}
                                </div>

                                {searchTerm.length >= 2 && (
                                    <div className="mt-2 max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl z-20 relative animate-in fade-in zoom-in-95 duration-200">
                                        {searching ? (
                                            <div className="px-5 py-6 text-sm text-slate-500 italic text-center flex items-center justify-center gap-3">
                                                <Loader2 className="h-5 w-5 animate-spin text-primary" /> Searching records…
                                            </div>
                                        ) : students.length > 0 ? (
                                            students.map(s => (
                                                <button
                                                    key={s._id}
                                                    type="button"
                                                    onClick={() => { setSelectedStudent(s); setSearchTerm(''); setStudents([]); }}
                                                    className="w-full text-left px-5 py-4 hover:bg-primary/5 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 group"
                                                >
                                                    <div className="font-black text-slate-900 dark:text-white text-base group-hover:text-primary transition-colors">{s.name}</div>
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.studentId} • {s.course}</div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-5 py-8 text-sm text-slate-500 font-medium text-center">No students found matching &quot;{searchTerm}&quot;</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="min-h-[100px] flex items-center">
                                {selectedStudent ? (
                                    <div className="w-full p-6 bg-primary/5 border-2 border-primary/20 rounded-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Selected Student Profile</p>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{selectedStudent.name}</h3>
                                                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-bold uppercase tracking-wider">{selectedStudent.studentId} • {selectedStudent.course}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedStudent(null)}
                                                className="px-3 py-1.5 text-[10px] font-black text-primary hover:bg-primary hover:text-white border border-primary/20 rounded-lg transition-all"
                                            >
                                                CHANGE
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 italic text-sm text-center">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                            <CreditCard className="h-6 w-6 opacity-40" />
                                        </div>
                                        Search and select a student to begin collection.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Step 2: Fee Items ── */}
                        {selectedStudent && (
                            <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-6 duration-500">

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        2. Fee Items *
                                    </label>

                                    <div className="space-y-3">
                                        {feeRows.map((row, idx) => (
                                            <div
                                                key={row.id}
                                                className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 border-border bg-white dark:bg-slate-900 focus-within:border-primary/40 shadow-sm"
                                            >
                                                {/* Row number */}
                                                <span className="text-[10px] font-black text-muted-foreground w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                    {idx + 1}
                                                </span>

                                                {/* Fee Description Input */}
                                                <div className="relative flex-1 min-w-[200px]">
                                                    <input
                                                        type="text"
                                                        placeholder="Fee description (e.g. Tuition Fees)"
                                                        className="input-field w-full h-12 text-sm font-bold !pl-4 pr-4"
                                                        value={row.type}
                                                        onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                                                    />
                                                </div>

                                                {/* Amount */}
                                                <div className="relative w-44 shrink-0">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-primary">₹</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="0.00"
                                                        className="input-field w-full !pl-10 h-12 text-lg font-black"
                                                        value={row.amount}
                                                        onChange={(e) => updateRow(row.id, 'amount', e.target.value)}
                                                    />
                                                </div>

                                                {/* Remove */}
                                                {feeRows.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFeeRow(row.id)}
                                                        className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all shrink-0 active:scale-95"
                                                        title="Remove Fee Item"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
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
                                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-black text-xs uppercase tracking-widest hover:border-primary hover:bg-primary/5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-sm"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Another Item
                                        </button>
                                    </div>

                                    {/* Total */}
                                    {total > 0 && (
                                        <div className="flex items-center justify-between px-6 py-6 bg-slate-900 dark:bg-primary/10 border border-slate-800 dark:border-primary/20 rounded-2xl shadow-xl animate-in zoom-in-95 duration-300">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 dark:text-primary uppercase tracking-[0.2em]">Total Amount Collected</p>
                                                <p className="text-[11px] text-slate-300 dark:text-slate-300 mt-1 font-bold uppercase tracking-tight">
                                                    {feeRows.filter(r => parseFloat(r.amount) > 0).map(r => r.type || 'Unnamed Fee').join(' + ')}
                                                </p>
                                            </div>
                                            <span className="text-4xl font-black text-white">₹{total.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                {/* ── Step 3: Payment Details ── */}
                                <div className="space-y-4 pt-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">3. Final Transaction Details</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">Payment Month *</label>
                                            <select
                                                className="input-field w-full bg-background h-14 cursor-pointer text-lg font-black !pl-4"
                                                value={paymentMonth}
                                                onChange={(e) => setPaymentMonth(e.target.value)}
                                            >
                                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                                    <option key={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">Payment Method</label>
                                            <select
                                                className="input-field w-full bg-background h-14 cursor-pointer text-lg font-black !pl-4"
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            >
                                                <option value="Cash">💵 Cash Payment</option>
                                                <option value="UPI">📱 UPI / Online Transfer</option>
                                                <option value="Bank Transfer">🏦 Direct Bank Deposit</option>
                                                <option value="Cheque">📄 Cheque Payment</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">Remarks / Note (optional)</label>
                                            <textarea
                                                className="input-field w-full min-h-[100px] py-4 text-base font-medium !pl-4"
                                                placeholder="Enter any additional payment details or notes here…"
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
                                    className="btn-primary w-full h-18 text-xl font-black uppercase tracking-widest flex items-center justify-center gap-4 rounded-2xl shadow-2xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] mt-8 overflow-hidden group relative"
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 slant-gradient" />
                                    {submitting
                                        ? <><Loader2 className="h-7 w-7 animate-spin" /> Processing…</>
                                        : <><Save className="h-7 w-7" /> Generate Receipt — ₹{total.toLocaleString()}</>
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
