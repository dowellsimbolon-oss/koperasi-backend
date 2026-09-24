const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Lokasi database
const dbPath = process.env.VERCEL 
    ? '/tmp/koperasi.db' 
    : path.join(__dirname, 'koperasi.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Gagal terhubung ke database SQLite:', err.message);
    } else {
        console.log('Terhubung ke database SQLite:', dbPath);
    }
});

// Inisialisasi Tabel dan Data Default
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nik TEXT UNIQUE,
            username TEXT,
            nama TEXT,
            password TEXT,
            role TEXT DEFAULT 'anggota'
        )
    `);

    // Tambahkan user default NIK: 123456 jika belum ada
    const checkUser = `SELECT COUNT(*) as count FROM users WHERE nik = '123456'`;
    db.get(checkUser, [], (err, row) => {
        if (row && row.count === 0) {
            const insertDefault = `INSERT INTO users (nik, username, nama, password, role) VALUES (?, ?, ?, ?, ?)`;
            db.run(insertDefault, ['123456', '123456', 'Anggota Koperasi', '123456', 'anggota']);
            console.log('User demo berhasil dibuat (NIK: 123456 | Password: 123456)');
        }
    });
});

module.exports = db;