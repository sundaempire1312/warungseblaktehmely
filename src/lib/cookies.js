import { cookies } from 'next/headers';

// Ambil data user dari cookies
export async function getUserFromCookies() {
    const cookieStore = await cookies(); // ✅ Pakai await di sini
    const userCookie = cookieStore.get('user');

    if (!userCookie || !userCookie.value || userCookie.value === 'undefined') {
        console.warn('User cookie kosong atau undefined.');
        return null;
    }

    try {
        const decoded = decodeURIComponent(userCookie.value);
        return JSON.parse(decoded);
    } catch (err) {
        console.error('Gagal parsing cookie:', err);
        return null;
    }
}

// Fungsi logout (hapus cookie)
export async function POST() {
    const cookieStore = await cookies(); // ✅ Tambahkan ini
    cookieStore.delete('user');

    return new Response(JSON.stringify({ success: true, message: 'Logout berhasil' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
