'use client';

import { useEffect, useState } from "react";
import Header from "../Header/Header";
import PopupForm from "../Form/PopupForm";
import { FiPlus, FiTrash2, FiSend, FiChevronLeft, FiChevronRight, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Notif from "../Notification/Notif";
import PopupTrans from "../Popup/PopupTrans";

export default function BerandaTab({ user }) {
    const [menuList, setMenuList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [penjualanList, setPenjualanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: '' // 'success' atau 'error'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTrans, setSelectedTrans] = useState(null);




    // Fungsi fetch penjualan dan menu DIDEFINISIKAN di luar useEffect
    const fetchPenjualan = async () => {
        try {
            const res = await fetch("/api/penjualan");
            const data = await res.json();
            if (data.success) {
                setPenjualanList(data.data || []);
            } else {
                console.error("Gagal fetch penjualan:", data.message);
            }
        } catch (err) {
            console.error("Fetch penjualan error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenu = async () => {
        try {
            const res = await fetch("/api/menu");
            const data = await res.json();
            if (data.success) setMenuList(data.produk);
        } catch (err) {
            console.error("Gagal ambil data menu:", err);
        }
    };

    // useEffect hanya memanggil fungsinya
    useEffect(() => {
        fetchPenjualan();
        fetchMenu();
    }, []);

    const generateId = (prefix = "ID") => {
        return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
    };

    const handleAddMenu = (item) => {
        const existing = selectedItems.find((i) => i.id_produk === item.id_produk);
        if (existing) {
            setSelectedItems((prev) =>
                prev.map((i) =>
                    i.id_produk === item.id_produk
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
            );
        } else {
            setSelectedItems((prev) => [
                ...prev,
                {
                    id_item: generateId("ITEM"),
                    ...item,
                    quantity: 1,
                },
            ]);
        }
    };

    const handleQtyChange = (id_produk, delta) => {
        setSelectedItems((prev) =>
            prev
                .map((item) =>
                    item.id_produk === id_produk
                        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const handleRemove = (id_produk) => {
        setSelectedItems((prev) => prev.filter((i) => i.id_produk !== id_produk));
    };

    const handleSubmit = async () => {
        const total_harga = selectedItems.reduce(
            (sum, item) => sum + item.harga * item.quantity,
            0
        );
        const total_laba = selectedItems.reduce(
            (sum, item) => sum + item.laba * item.quantity,
            0
        );

        const payload = {
            id_transaksi: generateId("TRX"),
            id_pegawai: user?.id_user || "UNKNOWN",
            nama: user?.nama || "Anonymous",
            tanggal: new Date().toISOString().split("T")[0],
            total_harga,
            total_laba,
            menu: selectedItems.map((item) => ({
                id_item: item.id_item,
                id_produk: item.id_produk,
                kode_produk: item.kode_produk,
                nama_produk: item.nama_produk,
                kategori: item.kategori,
                harga: item.harga,
                modal: item.modal,
                laba: item.laba,
                quantity: item.quantity,
            })),
        };

        setSubmitting(true);
        try {
            const res = await fetch("/api/penjualan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (result.success) {
                setNotification({
                    show: true,
                    message: "Pesanan berhasil dikirim!",
                    type: "success"
                });
                setIsModalOpen(false);
                setSelectedItems([]);
                fetchPenjualan();
            } else {
                setNotification({
                    show: true,
                    message: `Gagal menyimpan pesanan: ${result.message}`,
                    type: "error"
                });
            }

            // Sembunyikan notifikasi setelah 2 detik
            setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 2000);
        } catch (err) {
            alert("Terjadi kesalahan saat mengirim data.");
            console.error("POST error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const itemsPerPage = 8;

    // Urutkan berdasarkan index — data terbaru di akhir, kita balik
    const sortedData = [...penjualanList].reverse();

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    return (
        <div className="flex flex-col gap-3 p-4">
            <Header data={user} />

            <div className="flex flex-col-reverse md:flex-row gap-3">
                <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <motion.h3
                            className="text-lg font-semibold text-gray-800 py-4 md:py-0"
                            whileHover={{ scale: 1.02 }}
                        >
                            Riwayat Pesanan
                        </motion.h3>

                        {totalPages > 1 && (
                            <motion.div
                                className="flex justify-center gap-2 mb-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded border disabled:opacity-30 flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiChevronLeft /> Prev
                                </motion.button>

                                {[...Array(totalPages)].map((_, idx) => (
                                    <motion.button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx + 1)}
                                        className={`px-3 py-1 rounded border ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : ''}`}
                                        whileHover={{ scale: 1 }}
                                        whileTap={{ scale: 0.9 }}
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    >
                                        {idx + 1}
                                    </motion.button>
                                ))}

                                <motion.button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded border disabled:opacity-30 flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Next <FiChevronRight />
                                </motion.button>
                            </motion.div>
                        )}
                    </div>

                    {loading ? (
                        <motion.div
                            className="flex justify-center items-center h-32 pb-24"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </motion.div>
                    ) : penjualanList.length === 0 ? (
                        <motion.div
                            className="text-center py-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <p className="text-gray-500 text-sm">Belum ada data pesanan</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 pb-24 md:pb-0 md:max-h-[72vh] overflow-hidden">
                            <AnimatePresence>
                                {paginatedData.map((trx) => (
                                    <motion.div
                                        key={trx.id_transaksi}
                                        className="border rounded-xl p-5 border-blue-200 overflow-hidden"
                                        initial={{ opacity: 0, y: 1 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                        whileHover={{ scale: 1.01 }}
                                        layout
                                    >
                                        <div className="flex flex-wrap md:justify-between items-start gap-4">
                                            <div className="space-y-1.5">
                                                <h3 className="font-medium text-blue-600 transition-colors">
                                                    {trx.nama}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                        {trx.id_transaksi}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{trx.tanggal?.split("T")[0] || trx.tanggal}</span>
                                                </div>
                                                <div className="flex flex-col md:flex-row gap-4 pt-1">
                                                    <p className="text-sm">
                                                        <span className="text-gray-500">Total:</span>{' '}
                                                        <span className="font-medium text-gray-800">
                                                            Rp{trx.total_harga.toLocaleString()}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm">
                                                        <span className="text-gray-500">Laba:</span>{' '}
                                                        <span className="font-medium text-green-600">
                                                            Rp{trx.total_laba.toLocaleString()}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <motion.button
                                                onClick={() => setSelectedTrans(trx)}
                                                className="px-3 py-1.5 text-sm bg-white border hover:bg-blue-50 rounded-lg flex items-center gap-2 text-blue-600 transition-colors"
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                <FiInfo size={14} />
                                                <span className="cursor-pointer">Detail</span>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>

                {/* Input Pesanan Section */}
                <motion.div
                    className="p-6 h-[75vh] md:w-96 border border-gray-200 rounded-xl bg-white flex flex-col shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="flex flex-col justify-between items-center mb-6">
                        <motion.h3
                            className="text-xl hidden md:block mb-2 md:font-bold text-gray-800"
                            whileHover={{ scale: 1.01 }}
                        >
                            Input Pesanan
                        </motion.h3>
                        <motion.button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg flex items-center justify-center gap-2 shadow-md"
                            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiPlus size={18} />
                            Tambah Pesanan
                        </motion.button>
                    </div>

                    {/* Daftar Produk */}
                    <div className="flex-1 overflow-y-auto max-h-[calc(90vh-250px)] mb-4 space-y-3">
                        <AnimatePresence>
                            {selectedItems.length === 0 ? (
                                <motion.div
                                    className="text-center py-10 text-gray-500"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    Belum ada produk dipilih
                                </motion.div>
                            ) : (
                                selectedItems.map((item) => (
                                    <motion.div
                                        key={item.id_produk}
                                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, x: 50 }}
                                        transition={{ duration: 0.2 }}
                                        layout
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-800">{item.nama_produk}</p>
                                                <p className="text-sm text-gray-600">Rp {item.harga.toLocaleString()}</p>
                                            </div>
                                            <motion.button
                                                onClick={() => handleRemove(item.id_produk)}
                                                className="text-red-500 hover:text-red-700 text-sm flex items-center"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FiTrash2 size={14} className="mr-1" />
                                                Hapus
                                            </motion.button>
                                        </div>

                                        <div className="flex justify-between items-center mt-3">
                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    onClick={() => handleQtyChange(item.id_produk, -1)}
                                                    className="h-7 w-7 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-200"
                                                    whileTap={{ scale: 0.8 }}
                                                >
                                                    -
                                                </motion.button>
                                                <motion.input
                                                    type="number"
                                                    value={item.quantity}
                                                    readOnly
                                                    className="w-12 text-center border border-gray-300 rounded"
                                                    whileFocus={{ scale: 1.05 }}
                                                />
                                                <motion.button
                                                    onClick={() => handleQtyChange(item.id_produk, 1)}
                                                    className="h-7 w-7 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-200"
                                                    whileTap={{ scale: 0.8 }}
                                                >
                                                    +
                                                </motion.button>
                                            </div>
                                            <p className="font-medium">
                                                Rp {(item.harga * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Total dan Tombol Kirim */}
                    <motion.div
                        className="border-t pt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold">Total:</span>
                            <motion.span
                                className="font-bold text-lg text-blue-600"
                                key={selectedItems.reduce((total, item) => total + (item.harga * item.quantity), 0)}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                Rp {selectedItems.reduce((total, item) => total + (item.harga * item.quantity), 0).toLocaleString()}
                            </motion.span>
                        </div>
                        {selectedItems.length > 0 && (
                            <motion.button
                                onClick={handleSubmit}
                                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                                disabled={submitting}
                                whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(16, 185, 129, 0.4)" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {submitting ? (
                                    <motion.span
                                        className="flex items-center gap-2"
                                        animate={{ opacity: [0.6, 1, 0.6] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <FiSend size={18} />
                                        Mengirim...
                                    </motion.span>
                                ) : (
                                    <>
                                        <FiSend size={18} />
                                        Kirim Pesanan
                                    </>
                                )}
                            </motion.button>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <PopupForm
                    menuList={menuList}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleAddMenu={handleAddMenu}
                    setIsModalOpen={setIsModalOpen}
                    successMessage={successMessage}
                    setSuccessMessage={setSuccessMessage}
                />
            )}

            {/* Notif */}
            {notification.show && (
                <Notif message={notification.message} type={notification.type} />
            )}

            <PopupTrans
                isOpen={!!selectedTrans}
                data={selectedTrans}
                onClose={() => setSelectedTrans(null)}
            />
        </div>
    );
}
