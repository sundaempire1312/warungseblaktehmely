'use client';

import { useEffect, useState } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiLoader, FiPackage, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function DataMenu() {
    const [produk, setProduk] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 10;

    // Fetch data dari API
    useEffect(() => {
        async function fetchProduk() {
            try {
                const res = await fetch('/api/menu');
                const data = await res.json();

                if (data.success) {
                    setProduk(data.produk);
                    setFiltered(data.produk);
                } else {
                    console.error('Gagal:', data.message);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchProduk();
    }, []);

    // Handle search
    useEffect(() => {
        const keyword = search.toLowerCase();
        const hasilFilter = produk.filter((item) =>
            item.nama_produk.toLowerCase().includes(keyword)
        );
        setFiltered(hasilFilter);
        setCurrentPage(1);
    }, [search, produk]);

    // Pagination calculation
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedData = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <FiPackage className="text-blue-500" />
                    Data Produk
                </h2>
                
                <div className="relative max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama menu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <FiInfo className="text-blue-500" />
                    <span>Total produk: <strong className="text-gray-800">{filtered.length}</strong></span>
                </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center items-center py-12"
                >
                    <FiLoader className="animate-spin text-blue-500 text-2xl" />
                </motion.div>
            )}

            {/* Empty State */}
            {!loading && paginatedData.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-50 rounded-xl p-8 text-center"
                >
                    <p className="text-gray-500">Data tidak ditemukan</p>
                </motion.div>
            )}

            {/* Product List */}
            {!loading && paginatedData.length > 0 && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <AnimatePresence>
                        {paginatedData.map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <p className="font-semibold text-gray-800 text-lg">{item.nama_produk}</p>
                                <p className="text-blue-600 font-medium mt-2">
                                    Rp {item.harga.toLocaleString('id-ID')}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-2 mt-5 mb-20 md:mb-0"
                >
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors flex items-center gap-1"
                    >
                        <FiChevronLeft />
                        <span>Prev</span>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors flex items-center gap-1"
                    >
                        <span>Next</span>
                        <FiChevronRight />
                    </button>
                </motion.div>
            )}
        </div>
    );
}