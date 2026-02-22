import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import Student from '@/models/Student';
import Counter from '@/models/Counter';
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
        console.log('--- BILLING POST BODY ---', JSON.stringify(body, null, 2));

        // Generate a unique sequential invoice number like M-001, M-002...
        if (!body.invoiceNumber) {
            const counter = await Counter.findOneAndUpdate(
                { id: 'invoice_number' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            body.invoiceNumber = `M-${counter.seq.toString().padStart(3, '0')}`;
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
