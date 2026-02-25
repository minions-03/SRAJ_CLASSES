const mongoose = require('mongoose');

// We need to use raw mongodb driver or mongoose with environment variables
const MONGODB_URI = "mongodb+srv://srajgs2025_db_user:UkvFTkrJ07Y4UKNl@srajclasses.gpl1e0w.mongodb.net/?appName=SrajClasses";

async function findStudent() {
    try {
        await mongoose.connect(MONGODB_URI);
        const student = await mongoose.connection.db.collection('students').findOne({});
        console.log('STUDENT_FOUND:', JSON.stringify(student));
        await mongoose.disconnect();
    } catch (err) {
        console.error('ERROR:', err);
    }
}

findStudent();
