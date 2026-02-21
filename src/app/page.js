'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  Users,
  ReceiptIndianRupee,
  TrendingUp,
  Clock,
  ArrowUpRight,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    label: 'Total Students',
    value: '124',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    trend: '+12%',
    trendColor: 'text-green-500'
  },
  {
    label: 'Fees Collected',
    value: '₹4,50,000',
    icon: ReceiptIndianRupee,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    trend: '+8%',
    trendColor: 'text-green-500'
  },
  {
    label: 'Pending Dues',
    value: '₹85,000',
    icon: Clock,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    trend: '-5%',
    trendColor: 'text-amber-500'
  },
  {
    label: 'New Enrolments',
    value: '18',
    icon: UserPlus,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    trend: '+15%',
    trendColor: 'text-green-500'
  },
];

export default function Dashboard() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendColor}`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 glass-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Registrations</h2>
              <Link href="/students" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground text-sm">
                    <th className="pb-3 font-medium">Student Name</th>
                    <th className="pb-3 font-medium">Course</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[
                    { name: 'Rahul Kumar', course: 'SSC CGL', date: 'Oct 24, 2023', status: 'Active' },
                    { name: 'Anjali Sharma', course: 'Banking', date: 'Oct 23, 2023', status: 'Active' },
                    { name: 'Vikram Singh', course: 'Railway', date: 'Oct 22, 2023', status: 'Active' },
                    { name: 'Priya Verma', course: 'SSC CHSL', date: 'Oct 21, 2023', status: 'Active' },
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-4 font-medium">{row.name}</td>
                      <td className="py-4 text-sm">{row.course}</td>
                      <td className="py-4 text-sm text-muted-foreground">{row.date}</td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-500">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Summary */}
          <div className="space-y-6">
            <div className="glass-card bg-primary/5 border-primary/20">
              <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Collection (This Month)</span>
                  <span className="font-bold text-green-500">₹1,20,000</span>
                </div>
                <div className="w-full bg-border/50 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Target</span>
                  <span className="font-bold">₹1,60,000</span>
                </div>
              </div>
              <button className="btn-primary w-full mt-6 text-sm">Download Monthly Report</button>
            </div>

            <div className="glass-card">
              <h2 className="text-xl font-bold mb-4">Upcoming Due Dates</h2>
              <div className="space-y-4">
                {[
                  { name: 'Amit Jha', due: '₹5,000', date: 'In 2 days' },
                  { name: 'Suman Roy', due: '₹3,500', date: 'In 3 days' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <span className="font-bold text-amber-500 text-sm">{item.due}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
