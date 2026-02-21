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
}, {
    timestamps: true,
});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
