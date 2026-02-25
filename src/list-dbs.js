const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://srajgs2025_db_user:UkvFTkrJ07Y4UKNl@srajclasses.gpl1e0w.mongodb.net/?appName=SrajClasses";

async function listDBs() {
    try {
        await mongoose.connect(MONGODB_URI);
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('DATABASES:', JSON.stringify(dbs));
        await mongoose.disconnect();
    } catch (err) {
        console.error('ERROR:', err);
    }
}

listDBs();
