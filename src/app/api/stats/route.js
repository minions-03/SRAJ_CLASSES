import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';
import Invoice from '@/models/Invoice';
import Enrollment from '@/models/Enrollment';

// Cache this route for 60 seconds on Vercel to reduce serverless invocations
export const revalidate = 60;

export async function GET() {
    await dbConnect();

    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [totalStudents, feeAggregation, recentStudents, pendingApplications] = await Promise.all([
            Student.countDocuments(),
            // Compute ALL fee totals inside MongoDB — no data transferred to Node
            Invoice.aggregate([
                {
                    $group: {
                        _id: null,
                        totalFeesCollected: { $sum: '$amount' },
                        monthlyCollection: {
                            $sum: {
                                $cond: [{ $gte: ['$paymentDate', firstDayOfMonth] }, '$amount', 0],
                            },
                        },
                    },
                },
            ]),
            Student.find()
                .select('name rollNumber course createdAt')
                .sort({ createdAt: -1 })
                .limit(5),
            Enrollment.countDocuments({ status: 'Pending' }),
        ]);

        const { totalFeesCollected = 0, monthlyCollection = 0 } = feeAggregation[0] ?? {};

        return NextResponse.json({
            success: true,
            data: {
                totalStudents,
                totalFeesCollected,
                monthlyCollection,
                recentStudents,
                pendingApplications,
                target: 200000,
                pendingDues: 0,
            },
        });
    } catch (error) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
    }
}

