// ========================
// Puerto
// ========================
process.env.PORT = process.env.PORT || 3000;

// ========================
// Entorno
// ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================
// BD
// ========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:cafe123456@ds223343.mlab.com:23343/cafe';
}

process.env.URLDB = urlDB;