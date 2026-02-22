'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    Users,
    Filter,
    Plus,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Save,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';
import { SearchInput } from '@/components/SearchInput';
import { Modal } from '@/components/Modal';

const LIMIT = 10;

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

    // Edit modal state
    const [isEditing, setIsEditing] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editLoading, setEditLoading] = useState(false);

    // Delete confirmation state
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchStudents = useCallback(async (page, search) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: LIMIT });
            if (search) params.set('search', search);
            const res = await fetch(`/api/students?${params}`);
            const json = await res.json();
            if (json.success) {
                setStudents(json.data);
                setPagination(json.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch students:', error);
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudents(pagination.page, appliedSearch);
    }, [pagination.page, appliedSearch, fetchStudents]);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            setAppliedSearch(searchInput.trim());
            setPagination((prev) => ({ ...prev, page: 1 }));
        }
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchInput(val);
        if (val === '') {
            setAppliedSearch('');
            setPagination((prev) => ({ ...prev, page: 1 }));
        }
    };

    const clearSearch = () => {
        setSearchInput('');
        setAppliedSearch('');
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const goToPage = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    // ── Edit handlers ──
    const openEdit = (student) => {
        setSelectedStudent(student);
        setEditForm({
            name: student.name || '',
            phone: student.phone || '',
            email: student.email || '',
            course: student.course || '',
            totalFees: student.totalFees || 0,
            status: student.status || 'Active',
        });
        setIsEditing(true);
    };

    const handleEditSave = async () => {
        if (!selectedStudent) return;
        setEditLoading(true);
        try {
            const res = await fetch(`/api/students/${selectedStudent._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            const json = await res.json();
            if (json.success) {
                toast.success('Student updated successfully!');
                setIsEditing(false);
                fetchStudents(pagination.page, appliedSearch);
            } else {
                toast.error(json.error || 'Failed to update student.');
            }
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setEditLoading(false);
        }
    };

    // ── Delete handlers ──
    const handleDelete = async () => {
        if (!selectedStudent) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/students/${selectedStudent._id}`, {
                method: 'DELETE',
            });
            const json = await res.json();
            if (json.success) {
                toast.success(`${selectedStudent.name} has been deleted.`);
                setIsDeleting(false);
                fetchStudents(pagination.page, appliedSearch);
            } else {
                toast.error(json.error || 'Failed to delete student.');
            }
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Students Directory</h1>
                        <p className="text-muted-foreground mt-1">Manage and track all enrolled students in SRAJ Classes.</p>
                    </div>
                    <Link href="/students/add" className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20">
                        <Plus className="h-5 w-5" />
                        Enroll New Student
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <SearchInput
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        onClear={clearSearch}
                        placeholder="Search by name, student ID, or course… then press Enter"
                    />
                    <button className="btn-secondary flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </button>
                </div>

                {/* Applied search badge */}
                {appliedSearch && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Showing results for:</span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">
                            &ldquo;{appliedSearch}&rdquo;
                            <button onClick={clearSearch} className="ml-1 hover:text-primary/60 transition-colors">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                        <span className="text-xs">({pagination.total} results)</span>
                    </div>
                )}

                {/* Students Table */}
                <div className="glass-card overflow-hidden !p-0">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
                            <Loader2 className="h-10 w-10 animate-spin mb-4" />
                            <p>Loading students data...</p>
                        </div>
                    ) : students.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 border-b border-border/50">
                                    <tr className="text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <th className="px-6 py-4">Student ID</th>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4">Course</th>
                                        <th className="px-6 py-4">Total Fees</th>
                                        <th className="px-6 py-4">Paid</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {students.map((student) => (
                                        <tr key={student._id} className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-blue-600 dark:text-blue-400 font-bold">{student.studentId}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-black text-slate-900 dark:text-slate-100">{student.name}</div>
                                                <div className="text-[11px] text-slate-700 dark:text-slate-400 font-bold">{student.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[11px] font-black uppercase tracking-tight bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                                                    {student.course}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">₹{student.totalFees.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                                                    <div
                                                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.min((student.paidFees / student.totalFees) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                                                    ₹{student.paidFees.toLocaleString()} paid
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                                    student.status === 'Active' ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                                                )}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEdit(student)}
                                                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setIsDeleting(true);
                                                        }}
                                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
                            <Users className="h-16 w-16 mb-4 opacity-10" />
                            <p className="text-xl font-bold">No students found</p>
                            <p className="text-sm">
                                {appliedSearch
                                    ? `No results for "${appliedSearch}". Try a different search.`
                                    : 'Try adjusting your search or add a new student.'}
                            </p>
                            {!appliedSearch && (
                                <Link href="/students/add" className="btn-primary mt-6">Enroll New Student</Link>
                            )}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {!loading && pagination.totalPages > 0 && (
                        <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between flex-wrap gap-3">
                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">
                                Page {pagination.page} of {pagination.totalPages}
                                <span className="ml-3 text-primary opacity-60">({pagination.total} total students)</span>
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
                                                        : "border border-border hover:bg-muted"
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

            {/* ── Edit Modal ── */}
            <Modal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                title="Edit Student Profile"
                footer={
                    <>
                        <button onClick={() => setIsEditing(false)} className="btn-secondary px-6 h-10 text-sm">Cancel</button>
                        <button
                            onClick={handleEditSave}
                            disabled={editLoading}
                            className="btn-primary px-6 h-10 text-sm flex items-center gap-2"
                        >
                            {editLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </button>
                    </>
                }
            >
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Student Name</label>
                        <input
                            type="text"
                            className="input-field !pl-4"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Mobile No.</label>
                            <input
                                type="text"
                                className="input-field !pl-4"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Email ID</label>
                            <input
                                type="email"
                                className="input-field !pl-4"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Enrolled Course</label>
                            <input
                                type="text"
                                className="input-field !pl-4"
                                value={editForm.course}
                                onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Agreed Fees (₹)</label>
                            <input
                                type="number"
                                className="input-field !pl-4"
                                value={editForm.totalFees}
                                onChange={(e) => setEditForm({ ...editForm, totalFees: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Account Status</label>
                        <select
                            className="input-field !pl-4"
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </Modal>

            {/* ── Delete Confirmation ── */}
            <Modal
                isOpen={isDeleting}
                onClose={() => setIsDeleting(false)}
                title="Confirm Data Deletion"
                maxWidth="max-w-sm"
            >
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                        <Trash2 className="h-8 w-8 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Permanently delete?</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Are you sure you want to remove <span className="font-black text-slate-900 dark:text-white text-base">{selectedStudent?.name}</span> from the system?
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                        <button
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            className="w-full py-3 font-black text-xs uppercase tracking-widest rounded-xl bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            Delete Student
                        </button>
                        <button
                            onClick={() => setIsDeleting(false)}
                            className="w-full py-3 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Keep Record
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
