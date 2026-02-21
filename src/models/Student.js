import mongoose from 'mongoose';
import Counter from './Counter';

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this student.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    rollNumber: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address.'],
        maxlength: [100, 'Email cannot be more than 100 characters'],
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number.'],
    },
    course: {
        type: String,
        required: [true, 'Please specify the course.'],
    },
    enrollmentDate: {
        type: Date,
        default: Date.now,
    },
    totalFees: {
        type: Number,
        default: 0,
    },
    paidFees: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive', 'Completed'],
    },
}, {
    timestamps: true,
});

StudentSchema.pre('save', async function () {
    if (!this.rollNumber) {
        const year = new Date().getFullYear();
        const counterId = `rollnumber_${year}`;

        try {
            const counter = await Counter.findOneAndUpdate(
                { id: counterId },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const sequenceNumber = counter.seq.toString().padStart(3, '0');
            this.rollNumber = `SRAJ/${year}/${sequenceNumber}`;
        } catch (error) {
            console.error('Error in pre-save hook:', error);
            throw error;
        }
    }
});

// Clear model cache in development to ensure schema changes are applied
if (mongoose.models.Student) {
    delete mongoose.models.Student;
}

const Student = mongoose.model('Student', StudentSchema);

export default Student;
