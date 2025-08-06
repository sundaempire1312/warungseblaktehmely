// ❌ Jangan pakai 'use client' karena ini Server Component
import { getUserFromCookies } from '@/lib/cookies';
import { redirect } from 'next/navigation';
import Layout from '@/components/Layout/Layout';

export default async function BerandaPage() {
    const user = await getUserFromCookies();

    // ✅ Jika tidak ada user, langsung redirect ke /login
    if (!user) {
        redirect('/login');
    }

    return (
        <div className="md:p-3 flex w-full h-screen">
            <Layout user={user} />
        </div>
    );
}
