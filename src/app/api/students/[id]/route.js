import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    await dbConnect();
    try {
        const { id } = await params;
        const student = await Student.findById(id);
        if (!student) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: student });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(request, { params }) {
    await dbConnect();
    try {
        const { id } = await params;
        const body = await request.json();
        const student = await Student.findByIdAndUpdate(id, body, {
            returnDocument: 'after',
            runValidators: true,
        });
        if (!student) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: student });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    try {
        const { id } = await params;
        const deletedStudent = await Student.deleteOne({ _id: id });
        if (!deletedStudent.deletedCount) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
