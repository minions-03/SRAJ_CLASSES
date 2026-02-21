import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Student from '@/models/Student';

export async function GET() {
    try {
        await dbConnect();
        const enrollments = await Enrollment.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: enrollments });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        await dbConnect();
        const { id, status, reason } = await request.json();

        if (!['Approved', 'Rejected'].includes(status)) {
            return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
        }

        const enrollment = await Enrollment.findById(id);
        if (!enrollment) {
            return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404 });
        }

        enrollment.status = status;
        if (reason) enrollment.reason = reason;
        await enrollment.save();

        // If approved, create a student record
        if (status === 'Approved') {
            await Student.create({
                name: enrollment.name,
                email: enrollment.email,
                phone: enrollment.phone,
                course: enrollment.course,
                address: enrollment.address,
                enrollmentDate: new Date(),
                status: 'Active'
            });
        }

        return NextResponse.json({ success: true, message: `Application ${status.toLowerCase()} successfully.` });
    } catch (error) {
        console.error('Process Enrollment Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
