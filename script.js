// Pastikan URL menggunakan Domain Production Vercel Anda (TANPA tanda '/' di paling akhir)
const API_BASE_URL = 'https://koperasi-karyawan-ivia.vercel.app'; 

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm') || document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(event) {
    event.preventDefault();

    // Mengambil nilai dari field input
    const nikInput = document.getElementById('nik') || document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (!nikInput || !passwordInput) {
        alert('Elemen form input NIK/Password tidak ditemukan!');
        return;
    }

    const nik = nikInput.value.trim();
    const password = passwordInput.value.trim();

    if (!nik || !password) {
        alert('NIK / Nomor Anggota dan Password wajib diisi!');
        return;
    }

    try {
        // Pemanggilan fetch ke endpoint Back-End Vercel (/api/auth/login)
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nik, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login Berhasil!');
            
            // Simpan token atau session jika dikembalikan oleh server
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            // Redirect ke halaman dashboard jika ada
            // window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Login gagal! Periksa kembali NIK dan password Anda.');
        }
    } catch (error) {
        console.error('Error login:', error);
        alert('Gagal terhubung ke server Back-End.');
    }
}