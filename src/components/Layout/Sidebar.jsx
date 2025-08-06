'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHome,
    FiFileText,
    FiPackage,
    FiChevronRight,
    FiMenu
} from 'react-icons/fi';
import ButtonLogout from '../Button/ButtonLogout';

export default function Sidebar({ activeTab, setActiveTab }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const menuItems = [
        { name: 'Dashboard', key: 'laporan', icon: <FiHome size={20} /> },
        { name: 'Input Pesanan', key: 'beranda', icon: <FiFileText size={20} /> },
        { name: 'Data Produk', key: 'produk', icon: <FiPackage size={20} /> },
    ];

    const sidebarVariants = {
        expanded: { width: "240px" },
        collapsed: { width: "80px" }
    };

    const itemVariants = {
        expanded: { opacity: 1, x: 0 },
        collapsed: { opacity: 0, x: -20 }
    };

    const iconVariants = {
        expanded: { rotate: 0 },
        collapsed: { rotate: 180 }
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.div
                initial={false}
                animate={isExpanded ? "expanded" : "collapsed"}
                variants={sidebarVariants}
                className="hidden md:flex flex-col rounded-3xl p-4 border border-gray-200 shadow-lg overflow-hidden"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="flex items-center justify-between mb-8">
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xl font-bold text-gray-800"
                            >
                                Dashboard
                            </motion.h2>
                        )}
                    </AnimatePresence>

                    <motion.button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-full hover:bg-blue-100 text-gray-600"
                        variants={iconVariants}
                        transition={{ duration: 0.2 }}
                    >
                        <FiChevronRight size={20} />
                    </motion.button>
                </div>

                <div className="space-y-2">
                    {menuItems.map(item => (
                        <motion.button
                            key={item.key}
                            onClick={() => setActiveTab(item.key)}
                            className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab === item.key
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'text-gray-600 hover:bg-blue-100'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex-shrink-0">
                                {item.icon}
                            </div>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.span
                                        variants={itemVariants}
                                        initial="collapsed"
                                        animate="expanded"
                                        exit="collapsed"
                                        className="ml-3 whitespace-nowrap"
                                        transition={{ duration: 0.2 }}
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden flex justify-around bg-white p-3 fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 shadow-lg">
                {menuItems.map(item => (
                    <motion.button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`flex flex-col items-center p-2 rounded-full ${activeTab === item.key
                            ? 'text-blue-600'
                            : 'text-gray-500'
                            }`}
                        whileTap={{ scale: 0.9 }}
                    >
                        <div className="text-xl">
                            {item.icon}
                        </div>
                        <motion.span
                            className="text-xs mt-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {item.name}
                        </motion.span>
                    </motion.button>
                ))}
            </div>
        </>
    );
}