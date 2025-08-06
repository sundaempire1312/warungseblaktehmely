// app/api/logout/route.js
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies(); // ✅ gunakan await
    cookieStore.delete('user'); // Hapus cookie user

    return new Response(JSON.stringify({
        success: true,
        message: 'Logout berhasil',
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
