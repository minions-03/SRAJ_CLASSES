import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';

export async function POST(request) {
    try {
        await dbConnect();
        const data = await request.json();

        // Basic validation
        if (!data.name || !data.phone || !data.course || !data.email || !data.address) {
            return NextResponse.json(
                { success: false, message: 'Please provide all required fields (Name, Phone, Email, Address, Course).' },
                { status: 400 }
            );
        }

        // Phone validation
        const phoneRegex = /^\+91 [0-9]{10}$/;
        if (!phoneRegex.test(data.phone)) {
            return NextResponse.json(
                { success: false, message: 'Please provide a valid 10-digit phone number with +91 space prefix.' },
                { status: 400 }
            );
        }

        const enrollment = await Enrollment.create(data);

        return NextResponse.json({
            success: true,
            message: 'Application submitted successfully! Our team will contact you soon.',
            data: enrollment
        });
    } catch (error) {
        console.error('Enrollment Submission Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to submit application. Please try again later.' },
            { status: 500 }
        );
    }
}
