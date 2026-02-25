const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://srajgs2025_db_user:UkvFTkrJ07Y4UKNl@srajclasses.gpl1e0w.mongodb.net/?appName=SrajClasses";

async function checkIdType() {
    try {
        await mongoose.connect(MONGODB_URI);
        const student = await mongoose.connection.db.collection('students').findOne({});
        console.log('ID_TYPE:', typeof student._id);
        console.log('IS_OBJECT_ID:', student._id instanceof mongoose.Types.ObjectId);
        console.log('RAW_STUDENT:', student);
        await mongoose.disconnect();
    } catch (err) {
        console.error('ERROR:', err);
    }
}

checkIdType();
