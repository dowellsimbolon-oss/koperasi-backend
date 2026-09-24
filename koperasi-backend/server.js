const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Konfigurasi CORS agar mengizinkan request dari Live Server (127.0.0.1 / localhost) dan GitHub Pages
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Middleware Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cek Status Server (Root Endpoint)
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Server Koperasi Karyawan Berjalan!' });
});

// 4. Endpoint Login API
app.post('/api/auth/login', (req, res) => {
    const { nik, password } = req.body;

    if (!nik || !password) {
        return res.status(400).json({
            success: false,
            message: 'NIK / Nomor Anggota dan Password wajib diisi!'
        });
    }

    // Query pencarian user pada SQLite Database
    const query = `SELECT * FROM users WHERE nik = ? OR username = ?`;
    
    db.get(query, [nik, nik], (err, user) => {
        if (err) {
            console.error('Database Error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan pada server database.'
            });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'NIK / Nomor Anggota tidak ditemukan!'
            });
        }

        // Verifikasi password
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Password yang Anda masukkan salah!'
            });
        }

        // Response jika login berhasil
        return res.status(200).json({
            success: true,
            message: 'Login berhasil!',
            user: {
                id: user.id,
                nik: user.nik,
                nama: user.nama,
                role: user.role || 'anggota'
            }
        });
    });
});

// 5. Jalankan server secara lokal (diabaikan jika di Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`=================================`);
        console.log(`Server berjalan di http://localhost:${PORT}`);
        console.log(`=================================`);
    });
}

// Export aplikasi untuk Vercel
module.exports = app;