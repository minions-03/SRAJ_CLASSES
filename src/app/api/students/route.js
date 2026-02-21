import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    try {
        const students = await Student.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: students });
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
