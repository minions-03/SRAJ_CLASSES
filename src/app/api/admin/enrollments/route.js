import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Student from '@/models/Student';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
        const skip = (page - 1) * limit;

        const query = { status: { $ne: 'Approved' } };

        const [total, enrollments] = await Promise.all([
            Enrollment.countDocuments(query),
            Enrollment.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        ]);

        return NextResponse.json({
            success: true,
            data: enrollments,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        });
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
            const newStudent = await Student.create({
                name: enrollment.name,
                email: enrollment.email,
                phone: enrollment.phone,
                course: enrollment.course,
                address: enrollment.address,
                enrollmentDate: new Date(),
                status: 'Active'
            });

            // Send email notification with the generated studentId
            try {
                const { sendStudentIdEmail } = await import('@/lib/mail');
                await sendStudentIdEmail(newStudent.email, newStudent.name, newStudent.studentId);
            } catch (emailError) {
                console.error('Failed to send enrollment approval email:', emailError);
                // We don't fail the whole request if email fails, but we log it
            }
        }

        return NextResponse.json({ success: true, message: `Application ${status.toLowerCase()} successfully.` });
    } catch (error) {
        console.error('Process Enrollment Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
