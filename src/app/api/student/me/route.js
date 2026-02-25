import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';

async function getStudentFromToken(request) {
    const token = (await cookies()).get('student_token')?.value;
    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch {
        return null;
    }
}

export async function GET(request) {
    try {
        await dbConnect();
        const payload = await getStudentFromToken(request);
        if (!payload || !payload.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Handle case where id might be an object or string
        const idToFind = typeof payload.id === 'object' ? payload.id.toString() : payload.id;
        const student = await Student.findById(idToFind);

        if (!student) {
            return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, student });
    } catch (error) {
        console.error('Student Profile GET Error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const payload = await getStudentFromToken(request);
        if (!payload) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { name, email, phone, address } = data;

        const idToFind = typeof payload.id === 'object' ? payload.id.toString() : payload.id;
        const student = await Student.findByIdAndUpdate(
            idToFind,
            { name, email, phone, address },
            { new: true, runValidators: true }
        );

        if (!student) {
            return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, student });
    } catch (error) {
        console.error('Student Profile PUT Error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
    }
}
