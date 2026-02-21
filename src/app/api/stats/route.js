import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';
import Invoice from '@/models/Invoice';

export async function GET() {
    await dbConnect();

    try {
        const [totalStudents, invoices, recentStudents] = await Promise.all([
            Student.countDocuments(),
            Invoice.find({}),
            Student.find().sort({ createdAt: -1 }).limit(5)
        ]);

        const totalFeesCollected = invoices.reduce((sum, inv) => sum + inv.amount, 0);

        // Calculate collection this month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyCollection = invoices
            .filter(inv => new Date(inv.paymentDate) >= firstDayOfMonth)
            .reduce((sum, inv) => sum + inv.amount, 0);

        return NextResponse.json({
            success: true,
            data: {
                totalStudents,
                totalFeesCollected,
                monthlyCollection,
                recentStudents,
                // We'll calculate target and dues as mock for now or extend models later if needed
                target: 200000,
                pendingDues: 0
            }
        });
    } catch (error) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
    }
}
