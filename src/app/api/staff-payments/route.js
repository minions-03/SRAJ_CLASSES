import dbConnect from '@/lib/mongodb';
import StaffPayment from '@/models/StaffPayment';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    try {
        const payments = await StaffPayment.find({}).sort({ date: -1 });
        return NextResponse.json({ success: true, data: payments });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const payment = await StaffPayment.create(body);
        return NextResponse.json({ success: true, data: payment }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
