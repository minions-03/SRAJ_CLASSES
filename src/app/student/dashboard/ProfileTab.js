'use client';

import { useState } from 'react';

export default function ProfileTab({ student, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: student.name,
        email: student.email,
        phone: student.phone,
        address: student.address,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/student/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                onUpdate(data.student);
                setIsEditing(false);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const detailItem = (label, value, name, editable = false) => (
        <div className="py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                {label}
            </label>
            {isEditing && editable ? (
                <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 dark:text-slate-100 text-sm transition-all"
                />
            ) : (
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{value || '-'}</p>
            )}
        </div>
    );

    return (
        <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">My Profile</h3>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-4 py-2 rounded-lg transition-colors"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <div>
                        <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-tight">Personal Information</h4>
                        {detailItem('Full Name', student.name, 'name', true)}
                        {detailItem('Student ID', student.studentId)}
                        {detailItem('Email Address', student.email, 'email', true)}
                        {detailItem('Phone Number', student.phone, 'phone', true)}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-tight">Academic & Contact</h4>
                        {detailItem('Course', student.course)}
                        {detailItem('Enrollment Date', student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString('en-IN') : '-')}
                        {detailItem('Address', student.address, 'address', true)}
                        <div className="py-4 last:border-0">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                Fees Status
                            </label>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Paid: ₹{student.paidFees}</span>
                                <span className="text-slate-300 dark:text-slate-600">/</span>
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total: ₹{student.totalFees}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-8 flex space-x-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    name: student.name,
                                    email: student.email,
                                    phone: student.phone,
                                    address: student.address,
                                });
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-2 rounded-lg text-sm font-semibold transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
