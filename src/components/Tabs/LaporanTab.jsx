"use client"
import { useEffect, useState } from "react";
import SummaryCards from "../Dashboard/SummaryCards";
import ChartTren from "../Dashboard/ChartTren";
import FilterControls from "../Dashboard/FilterControls";
import FavoritMenu from "../Dashboard/TopProductsCard";

export default function LaporanTab() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [filter, setFilter] = useState({
        startDate: '',
        endDate: '',
    });

    const fetchPenjualan = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/penjualan");
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Gagal memuat data penjualan');
            }

            if (result.success) {
                setData(result.data || []);
            } else {
                setError(result.message || 'Data tidak valid');
            }
        } catch (err) {
            console.error("Fetch penjualan error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPenjualan();
    }, []);

    useEffect(() => {
        if (!filter.startDate || !filter.endDate) {
            setFilteredData(data);
            return;
        }

        const start = new Date(filter.startDate);
        const end = new Date(filter.endDate);

        const filtered = data.filter(item => {
            const date = new Date(item.tanggal);
            return date >= start && date <= end;
        });

        setFilteredData(filtered);
    }, [filter, data]);

    return (
        <div className="flex flex-col gap-3 p-4 pb-24">
            <h1 className="text-xl font-semibold mb-4">Dashboard</h1>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                    <p>Gagal memuat data: {error}</p>
                    <button
                        onClick={fetchPenjualan}
                        className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-700"
                    >
                        Coba Lagi
                    </button>
                </div>
            ) : (
                <SummaryCards
                    data={data}
                    isLoading={isLoading}
                />
            )}

            <FavoritMenu data={data} />
            <FilterControls filter={filter} setFilter={setFilter} />
            <ChartTren data={filteredData} isLoading={isLoading} />
        </div>
    );
}