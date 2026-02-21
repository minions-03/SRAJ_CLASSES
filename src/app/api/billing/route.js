import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    try {
        const invoices = await Invoice.find({}).populate('studentId').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: invoices });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();

        // Generate Invoice Number if not provided (e.g., INV-2023-001)
        if (!body.invoiceNumber) {
            const count = await Invoice.countDocuments();
            const year = new Date().getFullYear();
            body.invoiceNumber = `INV-${year}-${(count + 1).toString().padStart(4, '0')}`;
        }

        // Create the invoice
        const invoice = await Invoice.create(body);

        // Update student's paid fees
        await Student.findByIdAndUpdate(body.studentId, {
            $inc: { paidFees: body.amount }
        });

        return NextResponse.json({ success: true, data: invoice }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
