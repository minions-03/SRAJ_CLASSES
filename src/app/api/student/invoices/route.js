import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import connectMongo from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('student_token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        await connectMongo();
        const invoices = await Invoice.find({ studentId: payload.studentDbId })
            .sort({ paymentDate: -1 })
            .lean();

        return NextResponse.json({ success: true, data: invoices });
    } catch (error) {
        console.error('Student Invoices API Error:', error);
        return NextResponse.json({ success: false, message: 'Unauthorized or error' }, { status: 401 });
    }
}
