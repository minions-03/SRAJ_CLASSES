import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    await dbConnect();
    try {
        const { id } = await params;
        const invoice = await Invoice.findById(id).populate('studentId');
        if (!invoice) {
            return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: invoice });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
