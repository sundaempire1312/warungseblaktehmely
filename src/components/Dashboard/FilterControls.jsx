import React from 'react';
import { FiCalendar } from 'react-icons/fi';

export default function FilterControls({ filter, setFilter }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">Periode Tanggal</label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiCalendar className="text-gray-400" />
                        </div>
                        <input
                            type="date"
                            value={filter.startDate}
                            onChange={e => setFilter(prev => ({ ...prev, startDate: e.target.value }))}
                            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                            max={filter.endDate}
                        />
                    </div>
                    <span className="text-gray-500 hidden sm:block">-</span>
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiCalendar className="text-gray-400" />
                        </div>
                        <input
                            type="date"
                            value={filter.endDate}
                            onChange={e => setFilter(prev => ({ ...prev, endDate: e.target.value }))}
                            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                            min={filter.startDate}
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={() => setFilter({ startDate: '', endDate: '' })}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
            >
                Reset Filter
            </button>
        </div>
    );
}