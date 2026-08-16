"use client";

import { useMemo } from "react";
import { Room } from "@/types/room";

export interface FilterState {
  search: string;
  district: string;
  priceRange: string;
  minPrice: string;
  maxPrice: string;
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
  { label: "All ranges", value: "all" },
  { label: "7M - 10M VND (7tr - 10tr)", value: "7m_10m" },
  { label: "10M - 13M VND (10tr - 13tr)", value: "10m_13m" },
  { label: "13M - 15M VND (13tr - 15tr)", value: "13m_15m" },
  { label: "15M - 20M VND (15tr - 20tr)", value: "15m_20m" },
  { label: "Above 20M VND (> 20tr)", value: "over_20m" },
];

export const PRESET_PROPERTY_TYPES = [
  "Studio",
  "1-Bedroom Apartment",
  "2-Bedroom Apartment",
  "Penthouse",
];

export const PRESET_DISTRICTS = [
  "Son Tra",
  "Hai Chau",
  "Ngu Hanh Son",
  "Thanh Khe",
  "Lien Chieu",
  "Cam Le",
  "Hoa Vang",
];

function formatNumberWithDots(val: number | string): string {
  if (!val && val !== 0) return "";
  const clean = String(val).replace(/\D/g, "");
  if (!clean) return "";
  return Number(clean).toLocaleString("vi-VN");
}

function parseDotsToNumber(val: string): string {
  const clean = val.replace(/\D/g, "");
  return clean;
}

export default function RoomFilter({
  rooms,
  filters,
  onFilterChange,
  onReset,
}: RoomFilterProps) {
  const availableDistricts = useMemo(() => {
    const set = new Set<string>(PRESET_DISTRICTS);
    rooms.forEach((r) => {
      if (r.district) set.add(r.district.trim());
    });
    return Array.from(set).sort();
  }, [rooms]);

  const availableRoomTypes = useMemo(() => {
    const set = new Set<string>(PRESET_PROPERTY_TYPES);
    rooms.forEach((r) => {
      if (r.room_type) set.add(r.room_type.trim());
    });
    return Array.from(set).sort();
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
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
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

      {/* Grid of Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Preset Price Ranges */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Monthly Rent Range
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

        {/* District */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            District
          </label>
          <select
            value={filters.district}
            onChange={(e) => handleChange("district", e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          >
            <option value="all">All Locations</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
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

      {/* Custom Min / Max Price Inputs with Dot Formatting */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500">
          Custom Price Range (VND):
        </span>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-36">
            <input
              type="text"
              value={formatNumberWithDots(filters.minPrice)}
              onChange={(e) =>
                handleChange("minPrice", parseDotsToNumber(e.target.value))
              }
              placeholder="Min (e.g. 5.000.000)"
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            />
          </div>
          <span className="text-xs text-slate-400 font-bold">-</span>
          <div className="relative flex-1 sm:w-36">
            <input
              type="text"
              value={formatNumberWithDots(filters.maxPrice)}
              onChange={(e) =>
                handleChange("maxPrice", parseDotsToNumber(e.target.value))
              }
              placeholder="Max (e.g. 15.000.000)"
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            />
          </div>
          {(filters.minPrice !== "" || filters.maxPrice !== "") && (
            <button
              onClick={() => {
                handleChange("minPrice", "");
                handleChange("maxPrice", "");
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1.5"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
