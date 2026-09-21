"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Room, STATUS_LABELS, STATUS_COLORS } from "@/types/room";
import { useApp } from "@/context/AppContext";
import { CONTACT_CONFIG } from "@/config/contact";
import RoomMap from "@/components/RoomMap";

export default function SavedPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const { favorites, toggleFavorite, formatPrice } = useApp();

  useEffect(() => {
    async function fetchRooms() {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRooms(data as Room[]);
      }
      setLoading(false);
    }
    fetchRooms();
  }, []);

  const savedRooms = rooms.filter((r) => favorites.includes(r.id));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center text-lg shadow-sm group-hover:bg-sky-400 transition">
              🏠
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block leading-none">
                DA NANG HOMES
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Apartments & Rooms for Rent
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1.5 transition"
            >
              <svg
                className="w-4 h-4 text-sky-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to Listings</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-rose-500">❤️</span> Saved Properties
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Properties you have favorited for easy viewing & comparison
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedRooms.length > 0 && (
              <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-bold shadow-inner">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                    viewMode === "grid"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Cards</span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                    viewMode === "map"
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span>Map View</span>
                </button>
              </div>
            )}
            <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
              {savedRooms.length} Saved Item(s)
            </span>
          </div>
        </div>

        {loading && (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Loading saved properties...</p>
          </div>
        )}

        {!loading && savedRooms.length === 0 && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 text-2xl">
              ❤️
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              No Saved Properties Yet
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-6">
              Click the heart icon ❤️ on any property card to save it here for quick access & comparison.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              Explore All Listings →
            </Link>
          </div>
        )}

        {!loading && savedRooms.length > 0 && (
          viewMode === "map" ? (
            <div className="space-y-4">
              <RoomMap rooms={savedRooms} />
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-250 flex flex-col relative group"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  {room.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                      No photos available
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm font-semibold ${STATUS_COLORS[room.status]}`}
                    >
                      {STATUS_LABELS[room.status]}
                    </span>
                  </div>

                  {/* Heart Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(room.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white flex items-center justify-center backdrop-blur-md shadow transition"
                    title="Remove from favorites"
                  >
                    ❤️
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      <span>{room.district}</span>
                      {room.room_type && (
                        <>
                          <span>•</span>
                          <span className="text-sky-600">{room.room_type}</span>
                        </>
                      )}
                    </div>

                    <Link href={`/phong/${room.id}`}>
                      <h3 className="font-bold text-slate-900 text-base hover:text-sky-600 transition line-clamp-2 leading-snug">
                        {room.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1 truncate">
                      <svg
                        className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="truncate">{room.address}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                        Monthly Rent
                      </span>
                      <span className="text-base sm:text-lg font-extrabold text-rose-600">
                        {formatPrice(room.price, "/mo")}
                      </span>
                    </div>

                    <Link
                      href={`/phong/${room.id}`}
                      className="text-xs bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                    >
                      View Property →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 sm:px-6 border-t border-slate-800 text-center text-xs">
        © {new Date().getFullYear()} Da Nang Homes. All room information verified.
      </footer>
    </div>
  );
}
