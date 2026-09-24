// Otomatis gunakan localhost jika di-run lewat Live Server, atau gunakan URL Vercel jika online
const VERCEL_URL = 'https://koperasi-backend-1ekcnrbxy-frans-dowell.vercel.app/'; // Ganti dengan URL Vercel Anda

const API_BASE_URL = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')
    ? 'http://localhost:5000'
    : VERCEL_URL;

async function handleLogin(event) {
    if (event) event.preventDefault();

    // Mengambil input NIK dan Password
    const nikInput = document.querySelector('input[type="text"]') || document.getElementById('username');
    const passwordInput = document.querySelector('input[type="password"]') || document.getElementById('password');

    const nik = nikInput ? nikInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!nik || !password) {
        alert('NIK / Nomor Anggota dan Password wajib diisi!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nik, password })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert('Login Berhasil! Selamat Datang, ' + (result.user.nama || nik));
            // window.location.href = 'dashboard.html'; // Jika ada halaman dashboard
        } else {
            alert(result.message || 'Login gagal, periksa NIK dan Password!');
        }
    } catch (error) {
        console.error('Error Login:', error);
        alert('Gagal terhubung ke server Back-End. Pastikan Node.js berjalan di port 5000!');
    }
}