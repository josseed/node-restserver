// ========================
// Puerto
// ========================
process.env.PORT = process.env.PORT || 3000;

// ========================
// Entorno
// ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// ========================
// Expiration
// ========================
// 60 seconds
// 60 minutes
// 24 hours
// 30 days
process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;

// ========================
// Seed Auth
// ========================
process.env.SEED = process.env.SEED || 'this-is-the-seed-development';

// ========================
// BD
// ========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // urlDB = 'mongodb://user:password@ds223343.mlab.com:23343/cafe';
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;