import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import Student from '@/models/Student';
import Counter from '@/models/Counter';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
        const search = searchParams.get('search')?.trim() || '';
        const skip = (page - 1) * limit;

        // Build query for search
        let query = {};
        if (search) {
            // Find students matching the search term first to filter invoices by studentId
            const matchingStudents = await Student.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { studentId: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            const studentIds = matchingStudents.map(s => s._id);

            query = {
                $or: [
                    { invoiceNumber: { $regex: search, $options: 'i' } },
                    { studentId: { $in: studentIds } }
                ]
            };
        }

        const [total, invoices] = await Promise.all([
            Invoice.countDocuments(query),
            Invoice.find(query)
                .populate('studentId')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);

        return NextResponse.json({
            success: true,
            data: invoices,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Fetch invoices error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        console.log('--- BILLING POST BODY ---', JSON.stringify(body, null, 2));

        // Generate a unique sequential invoice number like M-001, M-002...
        if (!body.invoiceNumber) {
            const counter = await Counter.findOneAndUpdate(
                { id: 'invoice_number' },
                { $inc: { seq: 1 } },
                { returnDocument: 'after', upsert: true }
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
