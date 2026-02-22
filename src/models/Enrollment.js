import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address.'],
        maxlength: [100, 'Email cannot be more than 100 characters'],
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number.'],
        match: [/^\+91 [0-9]{10}$/, 'Please provide a valid 10-digit phone number with +91 space prefix.'],
    },
    course: {
        type: String,
        required: [true, 'Please specify the course.'],
    },
    address: {
        type: String,
        required: [true, 'Please provide an address.'],
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Approved', 'Rejected'],
    },
    reason: {
        type: String, // Optional reason for rejection/notes
    }
}, {
    timestamps: true,
});

// Indexes for faster queries
EnrollmentSchema.index({ status: 1 });
EnrollmentSchema.index({ createdAt: -1 });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
