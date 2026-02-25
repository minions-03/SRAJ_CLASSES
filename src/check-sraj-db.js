const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://srajgs2025_db_user:UkvFTkrJ07Y4UKNl@srajclasses.gpl1e0w.mongodb.net/SrajClasses?appName=SrajClasses";

async function checkSrajDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('COLLECTIONS:', collections.map(c => c.name));

        const count = await mongoose.connection.db.collection('students').countDocuments();
        console.log('STUDENT_COUNT:', count);

        const student = await mongoose.connection.db.collection('students').findOne({});
        console.log('SAMPLE_STUDENT:', JSON.stringify(student));

        await mongoose.disconnect();
    } catch (err) {
        console.error('ERROR:', err);
    }
}

checkSrajDB();
