import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request) {
    try {
        await dbConnect();
        const { studentId } = await request.json();

        if (!studentId) {
            return NextResponse.json({ success: false, message: 'Student ID is required' }, { status: 400 });
        }

        const student = await Student.findOne({ studentId });

        if (student) {
            const jwtSecret = process.env.JWT_SECRET;
            const secret = new TextEncoder().encode(jwtSecret);

            const token = await new SignJWT({
                id: student._id.toString(),
                studentId: student.studentId,
                role: 'student'
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('24h')
                .sign(secret);

            (await cookies()).set('student_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return NextResponse.json({ success: true, message: 'Login successful' });
        }

        return NextResponse.json({ success: false, message: 'Invalid Student ID' }, { status: 401 });
    } catch (error) {
        console.error('Student Login API Error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
