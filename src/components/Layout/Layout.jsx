'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import BerandaTab from '../Tabs/BerandaTab';
import LaporanTab from '../Tabs/LaporanTab';
import DataMenu from '../Tabs/DataMenu';

export default function Layout({ user }) {
    const [activeTab, setActiveTab] = useState('beranda');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'beranda':
                return <BerandaTab user={user} />;
            case 'laporan':
                return <LaporanTab />;
            case 'produk':
                return <DataMenu />;
            default:
                return <BerandaTab user={user} />;
        }
    };

    return (
        <div className="flex w-full h-full md:gap-3">
            <div className="flex">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <main className="flex-1 bg-white md:rounded-3xl shadow-lg border border-gray-200 overflow-auto">
                {renderTabContent()}
            </main>
        </div>

    );
}
