import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import connectMongo from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request) {
    try {
        const { studentId } = await request.json();

        if (!studentId) {
            return NextResponse.json({ success: false, message: 'Student ID is required.' }, { status: 400 });
        }

        await connectMongo();
        const student = await Student.findOne({ studentId: studentId.trim() });

        if (!student) {
            return NextResponse.json({ success: false, message: 'Invalid Student ID.' }, { status: 401 });
        }

        // Student ID is used as both username and password
        const jwtSecret = process.env.JWT_SECRET;
        const secret = new TextEncoder().encode(jwtSecret);

        const token = await new SignJWT({
            studentId: student.studentId,
            studentDbId: student._id.toString(),
            name: student.name,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('60m')
            .sign(secret);

        (await cookies()).set('student_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60, // 60 minutes
            path: '/',
        });

        return NextResponse.json({ success: true, message: 'Login successful', name: student.name });
    } catch (error) {
        console.error('Student Login API Error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
