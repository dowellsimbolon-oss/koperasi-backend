// Configuration URL Domain Backend Vercel
const API_BASE_URL = 'https://koperasi-backend-4u4eciliq-frans-dowell.vercel.app'; // Ganti dengan URL Vercel Anda 

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm') || document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(event) {
    event.preventDefault();

    // 1. Ambil elemen input NIK & Password
    const nikInput = document.getElementById('nik') || document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (!nikInput || !passwordInput) {
        alert('Elemen form input NIK atau Password tidak ditemukan!');
        return;
    }

    const nik = nikInput.value.trim();
    const password = passwordInput.value.trim();

    if (!nik || !password) {
        alert('NIK / Nomor Anggota dan Password wajib diisi!');
        return;
    }

    try {
        // 2. Variabel response terdefinisi dengan benar menggunakan 'const'
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nik, password })
        });

        // 3. Konversi response ke JSON
        const result = await response.json();

        // 4. Cek keberhasilan HTTP Status dan field success/token
        if (response.ok && (result.success || result.token)) {
            alert('Login Berhasil!');

            if (result.token) {
                localStorage.setItem('token', result.token);
            }
            if (result.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
            }

            // Arahkan ke halaman utama/dashboard jika ada
            // window.location.href = 'dashboard.html';
        } else {
            alert(result.message || 'Login gagal! Periksa NIK dan Password Anda.');
        }
    } catch (error) {
        console.error('Error login:', error);
        alert('Gagal terhubung ke server Back-End.');
    }
}