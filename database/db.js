const mongoose = require('mongoose');

const uri = 'mongodb+srv://zidny:123@backend7.q6wlw.mongodb.net/'

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log('Berhasil connect ke MongoDB...');
    } catch (error) {
        console.error('Gagal connect ke MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectDB;
