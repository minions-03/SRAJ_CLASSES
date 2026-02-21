'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  Users,
  ReceiptIndianRupee,
  TrendingUp,
  Clock,
  ArrowUpRight,
  UserPlus,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      label: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      trend: 'Total active'
    },
    {
      label: 'Fees Collected',
      value: `₹${stats?.totalFeesCollected?.toLocaleString() || 0}`,
      icon: ReceiptIndianRupee,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      trend: 'Lifetime total'
    },
    {
      label: 'Monthly Collection',
      value: `₹${stats?.monthlyCollection?.toLocaleString() || 0}`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      trend: 'This month'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">Welcome back, SRAJ Admin. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/students/add" className="btn-primary flex items-center gap-2 text-sm">
              <UserPlus className="h-4 w-4" />
              Add Student
            </Link>
            <Link href="/billing" className="btn-secondary flex items-center gap-2 text-sm">
              <ReceiptIndianRupee className="h-4 w-4" />
              Collect Fee
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="glass-card flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {stat.trend}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 glass-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold italic tracking-tight">Recent Registrations</h2>
              <Link href="/students" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <th className="pb-4 font-black">Student Details</th>
                    <th className="pb-4 font-black">Course</th>
                    <th className="pb-4 font-black">Joined Date</th>
                    <th className="pb-4 font-black text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {stats?.recentStudents?.length > 0 ? (
                    stats.recentStudents.map((student) => (
                      <tr key={student._id} className="group hover:bg-primary/[0.02] transition-colors">
                        <td className="py-4">
                          <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono uppercase">{student.rollNumber}</div>
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-0.5 bg-muted rounded text-[10px] font-bold text-muted-foreground uppercase">{student.course}</span>
                        </td>
                        <td className="py-4 text-xs font-medium text-slate-500">
                          {new Date(student.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 text-right">
                          <Link href={`/billing`} className="text-[10px] font-black text-primary hover:bg-primary/10 px-2 py-1 rounded transition-colors uppercase tracking-widest">
                            PAY FEE
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-muted-foreground italic text-sm">No recent registrations found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats / Target */}
          <div className="space-y-6">
            <div className="glass-card bg-primary/5 border-primary/20">
              <h2 className="text-xl font-bold mb-6 tracking-tight">Financial Pulse</h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target (Monthly)</span>
                  <span className="font-black text-slate-900 dark:text-white">₹{stats?.target?.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-1000"
                    style={{ width: `${Math.min((stats?.monthlyCollection / stats?.target) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Progress</span>
                  <span className="font-black text-green-500 text-sm">
                    {stats?.target > 0 ? Math.round((stats.monthlyCollection / stats.target) * 100) : 0}%
                  </span>
                </div>
              </div>
              <button className="btn-primary w-full mt-10 h-12 text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                View Detailed Report
              </button>
            </div>

            <div className="glass-card p-6 bg-green-500/5 border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white tracking-tight">Daily Insight</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Collection is up by <span className="text-green-500 font-bold">12%</span> compared to last week. Keep up the momentum!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
