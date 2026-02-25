import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

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
        if (!payload) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const idToFind = typeof payload.id === 'object' ? payload.id.toString() : payload.id;
        const invoices = await Invoice.find({ studentId: idToFind }).sort({ paymentDate: -1 });

        return NextResponse.json({ success: true, invoices });
    } catch (error) {
        console.error('Student Invoices GET Error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
