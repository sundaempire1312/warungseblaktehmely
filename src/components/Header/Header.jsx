'use client';
import { useState } from 'react';
import { FaUser, FaIdBadge, FaUserCircle, FaBars } from 'react-icons/fa';
import ButtonLogout from '../Button/ButtonLogout';

const Header = ({ data }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            {/* Sidebar untuk Mobile */}
            <div className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50 md:hidden`}>
                <div className="p-4 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-8">
                        <FaUserCircle className="text-3xl text-blue-500" />
                        <div>
                            <h1 className="text-lg font-semibold text-gray-800">{data.nama}</h1>
                            <p className="text-sm text-gray-500">{data.username}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-sm shadow-sm">
                            <FaIdBadge className="mr-2 text-blue-400" />
                            <div>
                                <p className="text-xs text-gray-500">ID Pegawai</p>
                                <p className="font-medium text-gray-700">{data.id_pegawai}</p>
                            </div>
                        </div>

                        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-sm shadow-sm">
                            <FaUser className="mr-2 text-blue-400" />
                            <div>
                                <p className="text-xs text-gray-500">Username</p>
                                <p className="font-medium text-gray-700">{data.username}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-sm mt-4">
                            <ButtonLogout />
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay ketika sidebar terbuka */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-opacity-100 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Header Utama */}
            <div className="p-4 w-full bg-white shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Kiri: Nama dan ucapan selamat + Hamburger Button */}
                    <div className="flex items-center justify-between md:justify-start gap-3">
                        <div className="flex items-center gap-3">
                            <FaUserCircle className="text-3xl text-blue-500" />
                            <div>
                                <h1 className="text-lg font-semibold text-gray-800">{data.nama}</h1>
                                <p className="text-sm text-gray-500">Selamat datang di dashboard</p>
                            </div>
                        </div>
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700"
                            onClick={toggleSidebar}
                        >
                            <FaBars className="text-xl" />
                        </button>
                    </div>

                    {/* Kanan: ID, Username, Logout - Tampil di desktop saja */}
                    <div className="hidden md:flex gap-3 items-center">
                        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-sm shadow-sm">
                            <FaIdBadge className="mr-2 text-blue-400" />
                            <div>
                                <p className="text-xs text-gray-500">ID Pegawai</p>
                                <p className="font-medium text-gray-700">{data.id_pegawai}</p>
                            </div>
                        </div>

                        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-sm shadow-sm">
                            <FaUser className="mr-2 text-blue-400" />
                            <div>
                                <p className="text-xs text-gray-500">Username</p>
                                <p className="font-medium text-gray-700">{data.username}</p>
                            </div>
                        </div>

                        <div className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition-colors">
                            <ButtonLogout />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;