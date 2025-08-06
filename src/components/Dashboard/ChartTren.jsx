import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler
);

export default function ChartTren({ data, isLoading }) {
    // Format data untuk chart
    const labels = data?.map(item => {
        const date = new Date(item.tanggal);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }) || [];

    const totalPendapatan = data?.map(item => item.total_harga) || [];
    const totalLaba = data?.map(item => item.total_laba) || [];
    const totalModal = data?.map(item => item.total_harga - item.total_laba) || [];

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Pendapatan',
                data: totalPendapatan,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#4CAF50',
                pointRadius: 3,
                pointHoverRadius: 5,
            },
            {
                label: 'Laba',
                data: totalLaba,
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#2196F3',
                pointRadius: 3,
                pointHoverRadius: 5,
            },
            {
                label: 'Modal (Estimasi)',
                data: totalModal,
                borderColor: '#FF9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#FF9800',
                pointRadius: 3,
                pointHoverRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: 'Inter, sans-serif',
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR'
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                        size: 10,
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    callback: function (value) {
                        return new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0
                        }).format(value);
                    }
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    // Skeleton Loading
    if (isLoading) {
        return (
            <div className="bg-white shadow-lg rounded-lg p-4 h-96 animate-pulse">
                <div className="h-6 w-1/3 bg-gray-200 rounded mb-6"></div>
                <div className="h-full bg-gray-100 rounded"></div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Tren Pendapatan & Laba</h2>
                <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                        Pendapatan
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        <span className="w-2 h-2 mr-1 bg-blue-500 rounded-full"></span>
                        Laba
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                        <span className="w-2 h-2 mr-1 bg-orange-500 rounded-full"></span>
                        Modal
                    </span>
                </div>
            </div>

            <div className="h-80">
                <Line
                    data={chartData}
                    options={options}
                />
            </div>

            <div className="mt-4 text-xs text-gray-500">
                <p>Data menampilkan tren pendapatan, laba, dan modal estimasi dalam periode tertentu.</p>
            </div>
        </div>
    );
}