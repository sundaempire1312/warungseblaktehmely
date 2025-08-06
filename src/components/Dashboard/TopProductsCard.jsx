'use client';
import React, { useMemo } from 'react';
import { FiStar, FiAward } from 'react-icons/fi';

export default function FavoritMenu({ data, isLoading }) {
    const topMenu = useMemo(() => {
        if (!data) return [];
        
        const menuCount = {};

        data.forEach((trx) => {
            trx.menu?.forEach((item) => {
                const nama = item.nama_produk;
                if (!menuCount[nama]) {
                    menuCount[nama] = {
                        nama_produk: nama,
                        total_quantity: 0,
                    };
                }
                menuCount[nama].total_quantity += item.quantity || 0;
            });
        });

        // Ubah jadi array dan sortir berdasarkan total_quantity
        const sorted = Object.values(menuCount).sort(
            (a, b) => b.total_quantity - a.total_quantity
        );

        return sorted.slice(0, 5); // Ambil 5 teratas
    }, [data]);

    // Skeleton Loading
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                    <div className="space-y-3">
                        {Array(5).fill(0).map((_, index) => (
                            <div key={index} className="flex justify-between">
                                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                                <div className="h-4 w-8 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Jika tidak ada data
    if (topMenu.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 text-center">
                <FiAward className="mx-auto text-3xl text-gray-300 mb-2" />
                <p className="text-gray-500">Belum ada data menu favorit</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <FiStar className="text-yellow-500" />
                <h2 className="text-lg font-semibold text-gray-800">5 Menu Paling Favorit</h2>
            </div>
            
            <ul className="space-y-3">
                {topMenu.map((menu, index) => (
                    <li key={index} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium 
                                ${index < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                {index + 1}
                            </span>
                            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                                {menu.nama_produk}
                            </span>
                        </div>
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                            {menu.total_quantity}x terjual
                        </span>
                    </li>
                ))}
            </ul>

            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                Berdasarkan total penjualan periode ini
            </div>
        </div>
    );
}