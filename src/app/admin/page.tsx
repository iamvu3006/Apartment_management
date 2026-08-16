"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Room, STATUS_LABELS, STATUS_COLORS } from "@/types/room";

export default function AdminPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setRooms(data as Room[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  async function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(`Xoá phòng "${title}"? Hành động này không thể hoàn tác.`);
    if (!confirmed) return;

    setDeletingId(id);
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    setDeletingId(null);

    if (error) {
      alert(`Lỗi khi xoá: ${error.message}`);
      return;
    }
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý phòng cho thuê</h1>
          <p className="text-stone-500 text-sm mt-1">
            {loading ? "Đang tải..." : `${rooms.length} phòng`}
          </p>
        </div>
        <Link
          href="/admin/new"
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2.5 rounded-lg transition"
        >
          + Thêm phòng mới
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          Lỗi tải dữ liệu: {error}
        </div>
      )}

      {!loading && rooms.length === 0 && !error && (
        <div className="text-center py-16 text-stone-500">
          Chưa có phòng nào. Bấm &quot;Thêm phòng mới&quot; để bắt đầu.
        </div>
      )}

      <div className="space-y-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex items-center gap-4 bg-white border border-stone-200 rounded-xl p-4"
          >
            {room.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={room.images[0]}
                alt={room.title}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 text-xs flex-shrink-0">
                Không ảnh
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-medium truncate">{room.title}</h2>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[room.status]}`}
                >
                  {STATUS_LABELS[room.status]}
                </span>
              </div>
              <p className="text-sm text-stone-500 mt-0.5 truncate">
                {room.address}, {room.district} · {room.area}m² ·{" "}
                {room.price.toLocaleString("vi-VN")}đ/tháng
              </p>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Link
                href={`/admin/${room.id}/edit`}
                className="px-3 py-1.5 text-sm border border-stone-300 rounded-lg hover:bg-stone-100 transition"
              >
                Sửa
              </Link>
              <button
                onClick={() => handleDelete(room.id, room.title)}
                disabled={deletingId === room.id}
                className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
              >
                {deletingId === room.id ? "Đang xoá..." : "Xoá"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
