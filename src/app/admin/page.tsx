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
    const confirmed = window.confirm(
      `Delete property "${title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    setDeletingId(null);

    if (error) {
      alert(`Error deleting property: ${error.message}`);
      return;
    }
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Manage Property Listings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? "Loading listings..." : `Total ${rooms.length} properties listed`}
          </p>
        </div>
        <Link
          href="/admin/new"
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition text-sm flex items-center gap-1.5"
        >
          <span>+ Add New Property</span>
        </Link>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 border border-rose-200 rounded-xl px-4 py-3 text-sm mb-6">
          Failed to load data: {error}
        </div>
      )}

      {!loading && rooms.length === 0 && !error && (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-500">
          No properties listed yet. Click &quot;Add New Property&quot; to begin.
        </div>
      )}

      <div className="space-y-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex items-center gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
          >
            {room.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={room.images[0]}
                alt={room.title}
                className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-slate-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs flex-shrink-0 font-medium">
                No photo
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-slate-900 truncate text-base">
                  {room.title}
                </h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-lg whitespace-nowrap ${STATUS_COLORS[room.status]}`}
                >
                  {STATUS_LABELS[room.status]}
                </span>
              </div>
              <p className="text-sm text-slate-500 truncate">
                {room.district} District · {room.area} m² ·{" "}
                <span className="font-bold text-rose-600">
                  {room.price.toLocaleString("en-US")} VND/mo
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {room.address}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href={`/phong/${room.id}`}
                target="_blank"
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition hidden sm:inline"
              >
                View
              </Link>
              <Link
                href={`/admin/${room.id}/edit`}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(room.id, room.title)}
                disabled={deletingId === room.id}
                className="px-3 py-1.5 text-xs font-semibold border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition disabled:opacity-50"
              >
                {deletingId === room.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
