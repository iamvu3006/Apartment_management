"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Room, STATUS_LABELS, STATUS_COLORS } from "@/types/room";
import { CONTACT_CONFIG } from "@/config/contact";

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    async function fetchRoom() {
      setLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Property not found or an error occurred.");
      } else {
        setRoom(data as Room);
      }
      setLoading(false);
    }
    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-6 h-6 border-3 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading property details...</span>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-6 max-w-3xl mx-auto text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            Property Not Found
          </h1>
          <p className="text-slate-500 mb-6 text-sm">
            This listing may have been unlisted or the URL is invalid.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm shadow-sm"
          >
            ← Return to Property Listings
          </Link>
        </div>
      </div>
    );
  }

  const hasImages = room.images && room.images.length > 0;
  const currentImage = hasImages
    ? room.images[activeImageIndex] || room.images[0]
    : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 lg:pb-12">
      {/* Header Navigation */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition"
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
            <span>Back to Property Listings</span>
          </Link>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-3 py-1 rounded-lg shadow-sm font-semibold ${STATUS_COLORS[room.status]}`}
            >
              {STATUS_LABELS[room.status]}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left & Middle Column: Image Gallery + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
              <div className="relative aspect-[16/10] bg-slate-900 flex items-center justify-center overflow-hidden">
                {currentImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentImage}
                    alt={room.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="text-slate-400 text-sm">No photos available</div>
                )}

                {hasImages && room.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === 0 ? room.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-xl p-2.5 backdrop-blur-md transition shadow-md"
                      aria-label="Previous Photo"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === room.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-xl p-2.5 backdrop-blur-md transition shadow-md"
                      aria-label="Next Photo"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    <div className="absolute bottom-3 right-3 bg-slate-900/75 text-white text-xs px-3 py-1 rounded-lg backdrop-blur-md font-semibold tracking-wide">
                      {activeImageIndex + 1} / {room.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {hasImages && room.images.length > 1 && (
                <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex gap-2.5 overflow-x-auto">
                  {room.images.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition ${
                        activeImageIndex === idx
                          ? "border-sky-600 ring-2 ring-sky-100 scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Overview Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-sky-600">
                  <span>{room.district} District</span>
                  {room.room_type && (
                    <>
                      <span>•</span>
                      <span>{room.room_type}</span>
                    </>
                  )}
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                  {room.title}
                </h1>
                <p className="text-slate-500 text-sm mt-2.5 flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 flex-shrink-0 text-slate-400"
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
                  {room.address}, {room.district} District, Da Nang
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">
                    Monthly Rent
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-rose-600">
                    {room.price.toLocaleString("en-US")} VND
                    <span className="text-xs font-normal text-slate-500">
                      /mo
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">
                    Living Area
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {room.area}{" "}
                    <span className="text-xs font-normal text-slate-500">m²</span>
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">
                    Property Type
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 truncate block">
                    {room.room_type || "Apartment / Room"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-sky-600 rounded-full"></span>
                  Property Description
                </h2>
                <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {room.description || "No description provided."}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Desktop Contact Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm sticky top-20 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider block">
                  Support & Viewing 24/7
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {CONTACT_CONFIG.ownerName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  English-speaking local rental consultant in Da Nang
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${CONTACT_CONFIG.phone}`}
                  className="flex items-center justify-center gap-2.5 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>Call {CONTACT_CONFIG.displayPhone}</span>
                </a>

                <a
                  href={`https://zalo.me/${CONTACT_CONFIG.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition text-sm"
                >
                  <span>Message on Zalo</span>
                </a>

                <a
                  href={`https://wa.me/${CONTACT_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition text-sm"
                >
                  <span>WhatsApp Chat</span>
                </a>

                {CONTACT_CONFIG.facebook && (
                  <a
                    href={CONTACT_CONFIG.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition text-sm"
                  >
                    <span>Facebook Messenger</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Mobile Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-30 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
          <a
            href={`tel:${CONTACT_CONFIG.phone}`}
            className="flex flex-col items-center justify-center py-2.5 px-1 bg-rose-600 text-white rounded-xl text-[11px] font-bold active:scale-95 transition shadow-sm"
          >
            <svg
              className="w-4 h-4 mb-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>Call Now</span>
          </a>

          <a
            href={`https://zalo.me/${CONTACT_CONFIG.zalo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2.5 px-1 bg-blue-600 text-white rounded-xl text-[11px] font-bold active:scale-95 transition shadow-sm"
          >
            <span className="font-extrabold text-xs leading-none mb-0.5">ZALO</span>
            <span>Zalo</span>
          </a>

          <a
            href={`https://wa.me/${CONTACT_CONFIG.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2.5 px-1 bg-emerald-600 text-white rounded-xl text-[11px] font-bold active:scale-95 transition shadow-sm"
          >
            <span className="font-extrabold text-xs leading-none mb-0.5">WA</span>
            <span>WhatsApp</span>
          </a>

          {CONTACT_CONFIG.facebook ? (
            <a
              href={CONTACT_CONFIG.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-2.5 px-1 bg-slate-900 text-white rounded-xl text-[11px] font-bold active:scale-95 transition shadow-sm"
            >
              <span className="font-extrabold text-xs leading-none mb-0.5">FB</span>
              <span>Facebook</span>
            </a>
          ) : (
            <div className="flex flex-col items-center justify-center py-2.5 px-1 bg-slate-100 text-slate-400 rounded-xl text-[11px] font-medium">
              <span>Da Nang</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
