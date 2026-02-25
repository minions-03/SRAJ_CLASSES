const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://srajgs2025_db_user:UkvFTkrJ07Y4UKNl@srajclasses.gpl1e0w.mongodb.net/?appName=SrajClasses";

async function checkTestDB() {
    try {
        await mongoose.connect(MONGODB_URI); // Connect to default (likely 'test')
        console.log('Connected to DB:', mongoose.connection.name);

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('COLLECTIONS:', collections.map(c => c.name));

        const firstStudent = await mongoose.connection.db.collection('students').findOne({});
        console.log('FIRST_STUDENT_RAW:', JSON.stringify(firstStudent));

        await mongoose.disconnect();
    } catch (err) {
        console.error('ERROR:', err);
    }
}

checkTestDB();
