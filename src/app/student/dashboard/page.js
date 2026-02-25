'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileTab from './ProfileTab';
import InvoicesTab from './InvoicesTab';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState('profile');
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/student/me');
                if (res.ok) {
                    const data = await res.json();
                    setStudent(data.student);
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    console.error('Failed to fetch profile:', errorData.message || res.statusText);
                    if (res.status === 401) {
                        router.push('/student/login');
                    } else {
                        setError('Failed to load profile');
                    }
                }
            } catch (err) {
                console.error('Network or unexpected error:', err);
                setError('Failed to load profile due to network error');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/student/logout', { method: 'POST' });
            router.push('/student/login');
        } catch (err) {
            console.error('Logout failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!student) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-blue-600">SRAJ</span>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">Student Portal</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{student.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{student.studentId}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ThemeToggle />
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-3 py-2 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex space-x-1 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl w-fit mb-8 transition-colors">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'profile'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('invoices')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'invoices'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                    >
                        Invoices
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
                    {activeTab === 'profile' ? (
                        <ProfileTab student={student} onUpdate={(updated) => setStudent(updated)} />
                    ) : (
                        <InvoicesTab studentId={student._id} />
                    )}
                </div>
            </main>
        </div>
    );
}
