const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://srajgs2025_db_user:UkvFTkrJ07Y4UKNl@srajclasses.gpl1e0w.mongodb.net/?appName=SrajClasses";

async function checkIds() {
    try {
        await mongoose.connect(MONGODB_URI);
        const students = await mongoose.connection.db.collection('students').find({}).limit(10).toArray();
        students.forEach(s => {
            console.log(`ID: ${s._id} | Length: ${s._id.toString().length} | Type: ${typeof s._id}`);
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error('ERROR:', err);
    }
}

checkIds();
