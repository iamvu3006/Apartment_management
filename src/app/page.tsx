"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Room, STATUS_LABELS, STATUS_COLORS } from "@/types/room";
import RoomFilter, { FilterState } from "@/components/RoomFilter";

const initialFilters: FilterState = {
  search: "",
  district: "all",
  priceRange: "all",
  roomType: "all",
  status: "all",
};

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    async function fetchRooms() {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setRooms(data as Room[]);
      setLoading(false);
    }
    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // 1. Tìm kiếm từ khoá (tiêu đề / địa chỉ)
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const titleMatch = room.title?.toLowerCase().includes(q);
        const addressMatch = room.address?.toLowerCase().includes(q);
        if (!titleMatch && !addressMatch) return false;
      }

      // 2. Lọc theo Quận / Khu vực
      if (filters.district !== "all") {
        if (
          room.district?.trim().toLowerCase() !==
          filters.district.trim().toLowerCase()
        ) {
          return false;
        }
      }

      // 3. Lọc theo Khoảng Giá
      if (filters.priceRange !== "all") {
        const p = Number(room.price);
        if (filters.priceRange === "under_3m" && p >= 3000000) return false;
        if (
          filters.priceRange === "3m_5m" &&
          (p < 3000000 || p > 5000000)
        )
          return false;
        if (
          filters.priceRange === "5m_8m" &&
          (p < 5000000 || p > 8000000)
        )
          return false;
        if (filters.priceRange === "over_8m" && p <= 8000000) return false;
      }

      // 4. Lọc theo Loại Phòng
      if (filters.roomType !== "all") {
        if (
          room.room_type?.trim().toLowerCase() !==
          filters.roomType.trim().toLowerCase()
        ) {
          return false;
        }
      }

      // 5. Lọc theo Trạng Thái
      if (filters.status !== "all") {
        if (room.status !== filters.status) return false;
      }

      return true;
    });
  }, [rooms, filters]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Phòng trọ / Căn hộ cho thuê tại Đà Nẵng
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Danh sách phòng cập nhật thực tế & đầy đủ hình ảnh
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-stone-500 hover:text-stone-700 underline"
        >
          Trang quản trị
        </Link>
      </div>

      {/* Component Bộ Lọc */}
      {!loading && (
        <RoomFilter
          rooms={rooms}
          filters={filters}
          onFilterChange={setFilters}
          onReset={() => setFilters(initialFilters)}
        />
      )}

      {loading && (
        <div className="py-12 text-center text-stone-500 flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Đang tải danh sách phòng...</span>
        </div>
      )}

      {!loading && filteredRooms.length === 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl py-12 px-6 text-center">
          <p className="text-stone-600 font-medium mb-1">
            Không tìm thấy phòng phù hợp
          </p>
          <p className="text-stone-400 text-sm mb-4">
            Vui lòng thử thay đổi từ khoá hoặc điều chỉnh lại các bộ lọc.
          </p>
          <button
            onClick={() => setFilters(initialFilters)}
            className="text-xs bg-orange-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      )}

      {!loading && filteredRooms.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4 text-sm text-stone-500">
            <span>Hiển thị {filteredRooms.length} phòng</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRooms.map((room) => (
              <Link
                key={room.id}
                href={`/phong/${room.id}`}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition block group"
              >
                {room.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-44 bg-stone-100 flex items-center justify-center text-stone-400 text-sm">
                    Chưa có ảnh
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-medium truncate group-hover:text-orange-600 transition">
                      {room.title}
                    </h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[room.status]}`}
                    >
                      {STATUS_LABELS[room.status]}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500">
                    {room.district} · {room.area}m²
                  </p>
                  <p className="text-orange-600 font-semibold mt-1">
                    {room.price.toLocaleString("vi-VN")}đ/tháng
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
