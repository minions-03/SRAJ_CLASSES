import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import connectMongo from '@/lib/mongodb';
import Student from '@/models/Student';

async function getStudentFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get('student_token')?.value;
    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch {
        return null;
    }
}

// GET: Return logged-in student's profile
export async function GET() {
    const payload = await getStudentFromToken();
    if (!payload) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectMongo();
        const student = await Student.findById(payload.studentDbId).select('-__v');
        if (!student) {
            return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: student });
    } catch (error) {
        console.error('Student ME GET Error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// PUT: Update editable student fields
export async function PUT(request) {
    const payload = await getStudentFromToken();
    if (!payload) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const allowedFields = ['name', 'email', 'phone', 'address'];
        const updates = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) updates[field] = body[field];
        }

        await connectMongo();
        const student = await Student.findByIdAndUpdate(
            payload.studentDbId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!student) {
            return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: student });
    } catch (error) {
        console.error('Student ME PUT Error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
    }
}
