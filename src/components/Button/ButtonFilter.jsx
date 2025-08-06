import { useState } from 'react';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { GiNoodles, GiMeat } from 'react-icons/gi';
import { BiDish } from 'react-icons/bi';
import { FaUtensils, FaFire } from 'react-icons/fa';
import { IoIosIceCream } from 'react-icons/io';

const ButtonFilter = () => {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const toggleMobileFilters = () => {
        setIsMobileFiltersOpen(!isMobileFiltersOpen);
    };

    return (
        <div className="p-4">
            {/* Desktop/Mobile Header */}
            <div
                className="flex items-center justify-between text-gray-600 cursor-pointer md:cursor-auto"
                onClick={toggleMobileFilters}
            >
                <div className="flex items-center">
                    <FaFilter className="mr-2 text-blue-500" />
                    <h3 className="font-medium text-gray-700">Filter Menu</h3>
                </div>
                <div className="md:hidden">
                    {isMobileFiltersOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
            </div>

            {/* Desktop Filter Buttons (always visible) */}
            <div className="p-2">
                <div className="flex items-center mb-3 text-gray-600">
                    <FaFilter className="mr-2 text-blue-500" />
                    <h3 className="font-medium text-gray-700">Filter Menu</h3>
                </div>

                <div className="flex flex-row gap-2">
                    <FilterButton active icon={<BiDish size={16} />} label="Semua"/>
                    <FilterButton icon={<GiMeat size={16} />} label="Bakso" />
                    <FilterButton icon={<GiNoodles size={16} />} label="Spaghetti" />
                    <FilterButton icon={<GiNoodles size={16} />} label="Mie" />
                    <FilterButton icon={<FaUtensils size={14} />} label="Seblak" />
                    <FilterButton icon={<BiDish size={16} />} label="Lainnya" />
                    <FilterButton icon={<IoIosIceCream size={16} />} label="Minuman Dingin" />
                    <FilterButton icon={<FaFire size={14} />} label="Minuman Hangat" />
                </div>
            </div>

            {/* Mobile Filter Buttons (conditional) */}
            {isMobileFiltersOpen && (
                <div className="md:hidden grid grid-cols-2 gap-2 mt-2">
                    <FilterButton active icon={<BiDish size={16} />} label="Semua" />
                    <FilterButton icon={<GiMeat size={16} />} label="Bakso" />
                    <FilterButton icon={<GiNoodles size={16} />} label="Spaghetti" />
                    <FilterButton icon={<GiNoodles size={16} />} label="Mie" />
                    <FilterButton icon={<FaUtensils size={14} />} label="Seblak" />
                    <FilterButton icon={<BiDish size={16} />} label="Lainnya" />
                    <FilterButton icon={<IoIosIceCream size={16} />} label="Minuman Dingin" />
                    <FilterButton icon={<FaFire size={14} />} label="Minuman Hangat" />
                </div>
            )}
        </div>
    );
};

const FilterButton = ({ active = false, icon, label }) => {
    return (
        <button className={`flex items-center justify-center px-3 py-2 rounded-full border text-sm transition-all w-full
      ${active
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'border-gray-200 hover:border-blue-200 hover:text-blue-500'}`}
        >
            <span className="mr-2">{icon}</span>
            {label}
        </button>
    );
};

export default ButtonFilter;