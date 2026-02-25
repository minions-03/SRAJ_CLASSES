import mongoose from 'mongoose';

const StaffPaymentSchema = new mongoose.Schema({
    teacherName: {
        type: String,
        required: [true, 'Please provide a teacher name.'],
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount.'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    month: {
        type: String,
        required: [true, 'Please provide the payment month.'],
    },
    remarks: {
        type: String,
    },
}, {
    timestamps: true,
});

export default mongoose.models.StaffPayment || mongoose.model('StaffPayment', StaffPaymentSchema);
