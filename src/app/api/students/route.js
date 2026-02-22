import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
        const search = searchParams.get('search')?.trim() || '';
        const skip = (page - 1) * limit;

        // Build query — regex search across name, studentId, course
        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { studentId: { $regex: search, $options: 'i' } },
                    { course: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        // Run count and paginated fetch in parallel; only select table columns
        const [total, students] = await Promise.all([
            Student.countDocuments(query),
            Student.find(query)
                .select('name studentId course phone email address totalFees paidFees status createdAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
        ]);

        return NextResponse.json({
            success: true,
            data: students,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const student = await Student.create(body);
        return NextResponse.json({ success: true, data: student }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
