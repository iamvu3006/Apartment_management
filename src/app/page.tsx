"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Room, STATUS_LABELS, STATUS_COLORS } from "@/types/room";

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Phòng trọ / Căn hộ cho thuê tại Đà Nẵng</h1>
        <Link
          href="/admin"
          className="text-sm text-stone-500 hover:text-stone-700 underline"
        >
          Trang quản trị
        </Link>
      </div>

      {loading && <p className="text-stone-500">Đang tải...</p>}

      {!loading && rooms.length === 0 && (
        <p className="text-stone-500">Hiện chưa có phòng nào được đăng.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((room) => (
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
    </div>
  );
}
