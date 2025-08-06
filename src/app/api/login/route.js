import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        const response = await fetch(process.env.NEXT_PUBLIC_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        // ✅ Set cookie jika login berhasil
        if (result.success && result.user) {
            const userData = encodeURIComponent(JSON.stringify(result.user));
            const cookieStore = await cookies(); // ✅ Await cookies()
            cookieStore.set('user', userData, {
                httpOnly: false, // true kalau tidak mau bisa dibaca client
                path: '/',
                maxAge: 60 * 60 * 24, // 1 hari
            });
        }

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Terjadi kesalahan saat login.',
                error: error.message,
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
