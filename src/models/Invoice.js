import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Please provide a student ID.'],
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount.'],
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque'],
        default: 'Cash',
    },
    paymentMonth: {
        type: String,
        required: [true, 'Please specify the payment month.'],
    },
    remarks: {
        type: String,
    },
    invoiceNumber: {
        type: String,
        unique: true,
        required: [true, 'Please provide an invoice number.'],
    },
    feeType: {
        type: String,
        default: 'Tuition Fees',
    },
    // Used when feeType === 'Combined' — stores individual line items
    feeBreakdown: [
        {
            label: { type: String },
            amount: { type: Number },
        },
    ],
}, {
    timestamps: true,
});

// Indexes for faster queries
InvoiceSchema.index({ studentId: 1 });
InvoiceSchema.index({ paymentDate: -1 });

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
