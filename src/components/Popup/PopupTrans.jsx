'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPrinter } from 'react-icons/fi';

export default function PopupTrans({ data, isOpen, onClose }) {
    if (!isOpen || !data) return null;

    const formatRupiah = (num) => `Rp${num.toLocaleString('id-ID')}`;

    // Fungsi untuk mencetak struk
    const handlePrint = () => {
        window.print();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm print:shadow-none print:border print:border-gray-200"
                >
                    <div className="flex justify-between items-center mb-4 print:hidden">
                        <h2 className="text-xl font-semibold">Struk Pembelian</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrint}
                                className="text-gray-500 hover:text-blue-500 p-1"
                                title="Cetak Struk"
                            >
                                <FiPrinter size={20} />
                            </button>
                            <button onClick={onClose} className="text-gray-500 hover:text-red-500 p-1">
                                <FiX size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Header Struk */}
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold">WARUNG SEBLAK TEH MELY</h1>
                        <p className="text-xs text-gray-500">Jl. Wado - Kirisik , Dusun Sukahurip, RT.001/RW.006, Pawenang, Kec. Jatinunggal</p>
                        <p className="text-xs text-gray-500">Telp: 0812-3456-7890</p>
                    </div>

                    {/* Info Transaksi */}
                    <div className="text-xs space-y-1 mb-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">No. Transaksi:</span>
                            <span>{data.id_transaksi}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Tanggal:</span>
                            <span>{new Date(data.tanggal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Kasir:</span>
                            <span>{data.nama}</span>
                        </div>
                    </div>

                    <hr className="border-dashed border-gray-300 my-2" />

                    {/* Daftar Produk */}
                    <div className="mb-4">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    <th className="text-left pb-1">Produk</th>
                                    <th className="text-right pb-1">Qty</th>
                                    <th className="text-right pb-1">Harga</th>
                                    <th className="text-right pb-1">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.menu.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="py-1">{item.nama_produk}</td>
                                        <td className="text-right py-1">{item.quantity}</td>
                                        <td className="text-right py-1">{formatRupiah(item.harga)}</td>
                                        <td className="text-right py-1">{formatRupiah(item.harga * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <hr className="border-dashed border-gray-300 my-2" />

                    {/* Total Pembayaran */}
                    <div className="text-xs space-y-1">
                        <div className="flex justify-between font-semibold">
                            <span>Total Harga:</span>
                            <span>{formatRupiah(data.total_harga)}</span>
                        </div>
                        {/* <div className="flex justify-between text-green-600">
                            <span>Total Laba:</span>
                            <span>{formatRupiah(data.total_laba)}</span>
                        </div> */}
                    </div>

                    {/* Footer Struk */}
                    <div className="text-center mt-6 text-xs text-gray-500">
                        <p>Terima kasih telah berbelanja</p>
                        <p>Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan</p>
                        <p className="mt-2">=== Layanan Konsumen ===</p>
                        <p>Email: tehmely@gmail.com</p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}