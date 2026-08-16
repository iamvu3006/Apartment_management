"use client";

import { useMemo } from "react";
import { Room } from "@/types/room";

export interface FilterState {
  search: string;
  district: string;
  priceRange: string;
  roomType: string;
  status: string;
}

interface RoomFilterProps {
  rooms: Room[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const PRICE_RANGES = [
  { label: "All Price Ranges", value: "all" },
  { label: "Under 3M VND (~$120)", value: "under_3m" },
  { label: "3M - 5M VND ($120 - $200)", value: "3m_5m" },
  { label: "5M - 8M VND ($200 - $320)", value: "5m_8m" },
  { label: "Above 8M VND (>$320)", value: "over_8m" },
];

export default function RoomFilter({
  rooms,
  filters,
  onFilterChange,
  onReset,
}: RoomFilterProps) {
  const availableDistricts = useMemo(() => {
    const districts = new Set<string>();
    rooms.forEach((r) => {
      if (r.district) districts.add(r.district.trim());
    });
    return Array.from(districts).sort();
  }, [rooms]);

  const availableRoomTypes = useMemo(() => {
    const types = new Set<string>();
    rooms.forEach((r) => {
      if (r.room_type) types.add(r.room_type.trim());
    });
    return Array.from(types).sort();
  }, [rooms]);

  function handleChange(field: keyof FilterState, value: string) {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  }

  const isFiltered =
    filters.search !== "" ||
    filters.district !== "all" ||
    filters.priceRange !== "all" ||
    filters.roomType !== "all" ||
    filters.status !== "all";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-600"></div>
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">
            Filter Properties
          </h2>
        </div>
        {isFiltered && (
          <button
            onClick={onReset}
            className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 transition"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Dropdown Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Price Range */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Monthly Rent
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleChange("priceRange", e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          >
            {PRICE_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* District / Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            District / Area
          </label>
          <select
            value={filters.district}
            onChange={(e) => handleChange("district", e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          >
            <option value="all">All Locations</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d.toLowerCase().includes("quận") || d.toLowerCase().includes("district")
                  ? d
                  : `${d} District`}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Property Type
          </label>
          <select
            value={filters.roomType}
            onChange={(e) => handleChange("roomType", e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          >
            <option value="all">All Types</option>
            {availableRoomTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Availability Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          >
            <option value="all">All Statuses</option>
            <option value="trong">🟢 Available</option>
            <option value="da_coc">🟡 Reserved</option>
            <option value="da_thue">⚪ Rented</option>
          </select>
        </div>
      </div>
    </div>
  );
}
