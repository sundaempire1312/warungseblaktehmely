// components/ButtonLogout.jsx
'use client';

import { useRouter } from 'next/navigation';

const ButtonLogout = () => {
    const router = useRouter();

    const handleLogout = async () => {
        const res = await fetch('/api/logout', {
            method: 'POST',
        });

        if (res.ok) {
            router.push('/login'); // Arahkan ke halaman login setelah logout
        } else {
            console.error('Gagal logout');
        }
    };

    return (
        <button
            onClick={handleLogout}
            className=" text-white cursor-pointer"
        >
            Logout
        </button>
    );
};

export default ButtonLogout;
