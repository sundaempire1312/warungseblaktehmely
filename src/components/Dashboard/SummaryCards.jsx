'use client';
import React, { useEffect, useState } from 'react';
import {
    parseISO,
    isToday,
    isYesterday,
    isThisWeek,
    isThisMonth,
    isThisYear,
    subWeeks,
    subMonths,
    subYears,
    isSameWeek,
    isSameMonth,
    isSameYear,
} from 'date-fns';

const SummaryCards = ({ data, isLoading }) => {
    const [summary, setSummary] = useState({
        today: { total: 0, laba: 0, modal: 0 },
        yesterday: { total: 0 },
        week: { total: 0 },
        lastWeek: { total: 0 },
        month: { total: 0 },
        lastMonth: { total: 0 },
        year: { total: 0 },
        lastYear: { total: 0 },
    });

    const sumGroupBy = (conditionFn) => {
        return data
            ?.filter((item) => conditionFn(parseISO(item.tanggal)))
            ?.reduce(
                (acc, curr) => {
                    acc.total += curr.total_harga || 0;
                    acc.laba += curr.total_laba || 0;
                    return acc;
                },
                { total: 0, laba: 0 }
            ) || { total: 0, laba: 0 };
    };

    const isLastWeek = (date) => {
        const lastWeek = subWeeks(new Date(), 1);
        return isSameWeek(date, lastWeek, { weekStartsOn: 1 });
    };

    const isLastMonth = (date) => {
        const lastMonth = subMonths(new Date(), 1);
        return isSameMonth(date, lastMonth);
    };

    const isLastYear = (date) => {
        const lastYear = subYears(new Date(), 1);
        return isSameYear(date, lastYear);
    };

    const calculatePercentageChange = (current, previous) => {
        if (previous === 0 && current === 0) return 0;
        if (previous === 0) return 100;
        return (((current - previous) / previous) * 100).toFixed(1);
    };

    useEffect(() => {
        if (!data) return;

        const today = sumGroupBy(isToday);
        const yesterday = sumGroupBy(isYesterday);
        const week = sumGroupBy(isThisWeek);
        const lastWeek = sumGroupBy(isLastWeek);
        const month = sumGroupBy(isThisMonth);
        const lastMonth = sumGroupBy(isLastMonth);
        const year = sumGroupBy(isThisYear);
        const lastYear = sumGroupBy(isLastYear);

        setSummary({
            today: { ...today, modal: today.total - today.laba },
            yesterday,
            week,
            lastWeek,
            month,
            lastMonth,
            year,
            lastYear,
        });
    }, [data]);

    const cards = [
        {
            title: 'Omset Hari Ini',
            value: summary.today.total,
            change: calculatePercentageChange(summary.today.total, summary.yesterday.total),
            icon: '📅',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Minggu Ini',
            value: summary.week.total,
            change: calculatePercentageChange(summary.week.total, summary.lastWeek.total),
            icon: '📆',
            color: 'bg-purple-50 text-purple-600',
        },
        {
            title: 'Bulan Ini',
            value: summary.month.total,
            change: calculatePercentageChange(summary.month.total, summary.lastMonth.total),
            icon: '🗓️',
            color: 'bg-yellow-50 text-yellow-600',
        },
        {
            title: 'Tahun Ini',
            value: summary.year.total,
            change: calculatePercentageChange(summary.year.total, summary.lastYear.total),
            icon: '📊',
            color: 'bg-red-50 text-red-600',
        },
        {
            title: 'Pendapatan Hari Ini',
            value: summary.today.laba,
            change: null,
            icon: '',
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            title: 'Modal Hari Ini',
            value: summary.today.modal,
            change: null,
            icon: '',
            color: 'bg-gray-50 text-gray-600',
        },
    ];

    const SkeletonCard = () => (
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200 h-full">
            <div className="animate-pulse space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-7 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {isLoading ? (
                Array(6).fill(0).map((_, index) => (
                    <SkeletonCard key={`skeleton-${index}`} />
                ))
            ) : (
                cards.map((card, index) => (
                    <div
                        key={index}
                        className={`rounded-xl p-4 shadow-sm border border-gray-200 transition-all hover:shadow-md ${card.color}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-sm sm:text-base">{card.title}</h3>
                            <span className="text-xl">{card.icon}</span>
                        </div>

                        <p className="text-xl sm:text-2xl font-bold mb-2">
                            {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                maximumFractionDigits: 0
                            }).format(card.value)}
                        </p>

                        {card.change !== null && (
                            <div className="flex items-center">
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                    ${card.change > 0
                                            ? 'bg-green-100 text-green-800'
                                            : card.change < 0
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {card.change > 0 ? '↑' : card.change < 0 ? '↓' : '→'}
                                    {Math.abs(card.change)}%
                                </span>
                                <span className="ml-1 text-xs text-gray-500 truncate">
                                    {card.change == 0
                                        ? 'Tidak berubah'
                                        : card.change > 0
                                            ? 'naik'
                                            : 'turun'}
                                </span>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default SummaryCards;