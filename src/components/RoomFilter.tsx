"use client";

import { useMemo } from "react";
import { Room, RoomStatus } from "@/types/room";

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
  { label: "Tất cả mức giá", value: "all" },
  { label: "Dưới 3 triệu", value: "under_3m" },
  { label: "3 - 5 triệu", value: "3m_5m" },
  { label: "5 - 8 triệu", value: "5m_8m" },
  { label: "Trên 8 triệu", value: "over_8m" },
];

export default function RoomFilter({
  rooms,
  filters,
  onFilterChange,
  onReset,
}: RoomFilterProps) {
  // Trích xuất danh sách Quận và Loại phòng thực tế từ dữ liệu
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
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-8 space-y-4">
      {/* Ô tìm kiếm từ khoá */}
      <div className="relative">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          placeholder="Tìm kiếm theo tiêu đề, địa chỉ..."
          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
        />
        <svg
          className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {filters.search && (
          <button
            onClick={() => handleChange("search", "")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold bg-stone-200 rounded-full w-5 h-5 flex items-center justify-center"
          >
            ×
          </button>
        )}
      </div>

      {/* Lưới các bộ lọc Dropdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Lọc Theo Khoảng Giá */}
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">
            Mức giá
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleChange("priceRange", e.target.value)}
            className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
          >
            {PRICE_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc Theo Quận / Khu vực */}
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">
            Khu vực / Quận
          </label>
          <select
            value={filters.district}
            onChange={(e) => handleChange("district", e.target.value)}
            className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
          >
            <option value="all">Tất cả khu vực</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc Theo Loại Phòng */}
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">
            Loại phòng
          </label>
          <select
            value={filters.roomType}
            onChange={(e) => handleChange("roomType", e.target.value)}
            className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
          >
            <option value="all">Tất cả loại phòng</option>
            {availableRoomTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc Theo Trạng Thái */}
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">
            Trạng thái
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="trong">Còn trống</option>
            <option value="da_coc">Đã cọc</option>
            <option value="da_thue">Đã cho thuê</option>
          </select>
        </div>
      </div>

      {/* Nút xoá bộ lọc */}
      {isFiltered && (
        <div className="flex justify-end pt-1">
          <button
            onClick={onReset}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 transition"
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
            Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
