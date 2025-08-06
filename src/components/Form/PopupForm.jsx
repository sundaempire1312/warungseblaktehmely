'use client';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSearch, FiCheckCircle, FiPlus, FiLoader } from "react-icons/fi";

export default function PopupForm({
    menuList,
    searchTerm,
    setSearchTerm,
    handleAddMenu,
    setIsModalOpen,
    successMessage,
    setSuccessMessage,
    isLoading // Tambahkan prop isLoading untuk menandakan loading state
}) {
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (successMessage) {
            const timeout = setTimeout(() => setSuccessMessage(""), 1500);
            return () => clearTimeout(timeout);
        }
    }, [successMessage]);

    useEffect(() => {
        // Set loading awal saat komponen pertama kali mount
        const timer = setTimeout(() => {
            setIsInitialLoad(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", damping: 25 }
        }
    };

    const notificationVariants = {
        hidden: { y: -50, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: -50, opacity: 0 }
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: (i) => ({
            x: 0,
            opacity: 1,
            transition: { delay: i * 0.05 }
        })
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={backdropVariants}
            >
                {/* Modal Container */}
                <motion.div
                    className={`bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col 
                        w-[95%] max-w-[calc(100%-2rem)] 
                        md:w-[32rem] md:max-w-none`}
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {/* Loading Indicator */}
                    {(isLoading || isInitialLoad) && (
                        <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center gap-3">
                            <FiLoader className="animate-spin text-blue-600 text-2xl" />
                            <p className="text-gray-600 font-medium">Memuat data menu...</p>
                        </div>
                    )}

                    {/* Notification */}
                    <AnimatePresence>
                        {successMessage && (
                            <motion.div
                                className={`fixed z-50 left-1/2 transform -translate-x-1/2
                                    top-4 w-[90%] max-w-[20rem]
                                    md:top-6 md:w-auto md:max-w-none`}
                                variants={notificationVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2
                                    text-sm md:text-base md:px-6">
                                    <FiCheckCircle className="text-white flex-shrink-0" />
                                    <span className="truncate">{successMessage}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Header */}
                    <div className="border-b p-4 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500">
                        <h2 className="text-xl font-bold text-white">Pilih Menu</h2>
                        <motion.button
                            onClick={() => setIsModalOpen(false)}
                            className="p-2 rounded-full hover:bg-white/20 text-white"
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiX size={20} />
                        </motion.button>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto flex-1">
                        {/* Search */}
                        <div className="relative mb-6 group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400 group-focus-within:text-blue-500" />
                            </div>
                            <motion.input
                                type="text"
                                placeholder="Cari menu..."
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    border-gray-300 hover:border-blue-300 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                whileFocus={{ scale: 1.01 }}
                                disabled={isLoading || isInitialLoad}
                            />
                        </div>

                        {/* Menu List */}
                        {!isLoading && !isInitialLoad ? (
                            <div className="space-y-3">
                                {menuList.length > 0 ? (
                                    menuList
                                        .filter((item) =>
                                            item.nama_produk.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((item, index) => (
                                            <motion.button
                                                key={item.id_produk}
                                                custom={index}
                                                initial="hidden"
                                                animate="visible"
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    handleAddMenu(item);
                                                    setSuccessMessage(`${item.nama_produk}`);
                                                }}
                                                className="cursor-pointer w-full p-4 border rounded-lg text-left hover:border-blue-300 hover:bg-blue-50 transition-all
                                                    flex justify-between items-center group"
                                            >
                                                <div>
                                                    <p className="font-semibold text-gray-800 group-hover:text-blue-600">
                                                        {item.nama_produk}
                                                    </p>
                                                    <span className="text-sm text-gray-500">{item.kategori}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-medium text-blue-600 whitespace-nowrap">
                                                        Rp{item.harga.toLocaleString()}
                                                    </span>
                                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full
                                                        group-hover:bg-blue-500 group-hover:text-white">
                                                        <FiPlus size={16} />
                                                    </div>
                                                </div>
                                            </motion.button>
                                        ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        Tidak ada menu tersedia
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* Footer */}
                    <div className="border-t p-3 bg-gray-50 text-center text-sm text-gray-600">
                        <span className="hidden md:inline">Klik item untuk menambahkan ke pesanan | </span>
                        {!isLoading && !isInitialLoad && (
                            <span>Total menu: {menuList.length}</span>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}