// app/not-found.jsx
import Link from 'next/link'
import Head from 'next/head'

export default function NotFound() {
    return (
        <>
            <Head>
                <title>Halaman Tidak Ditemukan - 404</title>
                <meta name="description" content="Halaman yang Anda cari tidak ditemukan" />
            </Head>

            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4">
                <div className="max-w-md w-full text-center">
                    <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
                    <h2 className="text-2xl font-semibold mb-2">Halaman Tidak Ditemukan</h2>
                    <p className="mb-6">
                        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </>
    )
}