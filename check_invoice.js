const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://srajgs2025_db_user:l4nCOGlqfhzcHYxW@srajclasses.gpl1e0w.mongodb.net/?appName=SrajClasses";

const InvoiceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    amount: Number,
    paymentMethod: String,
    paymentMonth: String,
    paymentDate: { type: Date, default: Date.now },
    invoiceNumber: String,
    remarks: String,
    feeType: String,
    feeBreakdown: [
        {
            label: String,
            amount: Number,
        },
    ],
});

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);

async function checkInvoice() {
    try {
        await mongoose.connect(MONGODB_URI);
        const inv = await Invoice.findById('699a9b092a65d3f1c9fd7262');
        console.log('--- DATA START ---');
        console.log(JSON.stringify(inv, null, 2));
        console.log('--- DATA END ---');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkInvoice();
