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
        setError("Không tìm thấy thông tin phòng hoặc đã xảy ra lỗi.");
      } else {
        setRoom(data as Room);
      }
      setLoading(false);
    }
    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center py-20 px-6">
        <div className="flex items-center gap-3 text-stone-500">
          <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Đang tải thông tin phòng...</span>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-stone-50 py-20 px-6 max-w-3xl mx-auto text-center">
        <h1 className="text-xl font-bold text-stone-800 mb-2">
          Không tìm thấy phòng
        </h1>
        <p className="text-stone-500 mb-6 text-sm">
          Phòng này có thể đã bị xoá hoặc liên kết không đúng.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-lg transition text-sm"
        >
          ← Quay lại danh sách phòng
        </Link>
      </div>
    );
  }

  const hasImages = room.images && room.images.length > 0;
  const currentImage = hasImages
    ? room.images[activeImageIndex] || room.images[0]
    : null;

  return (
    <div className="min-h-screen bg-stone-50 pb-24 md:pb-12">
      {/* Header điều hướng */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-stone-600 hover:text-stone-900 text-sm font-medium flex items-center gap-1.5 transition"
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
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Về danh sách phòng
          </Link>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[room.status]}`}
          >
            {STATUS_LABELS[room.status]}
          </span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái & giữa: Ảnh Gallery + Nội dung */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery ảnh */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="relative aspect-[16/10] bg-stone-100 flex items-center justify-center overflow-hidden">
                {currentImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentImage}
                    alt={room.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="text-stone-400 text-sm">Chưa có hình ảnh</div>
                )}

                {hasImages && room.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === 0 ? room.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition"
                      aria-label="Ảnh trước"
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
                          strokeWidth={2}
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition"
                      aria-label="Ảnh sau"
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
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
                      {activeImageIndex + 1} / {room.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {hasImages && room.images.length > 1 && (
                <div className="p-3 bg-stone-50 border-t border-stone-100 flex gap-2 overflow-x-auto">
                  {room.images.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                        activeImageIndex === idx
                          ? "border-orange-600 ring-2 ring-orange-200"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Thông tin phòng */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-orange-600">
                  <span>{room.district}</span>
                  <span>•</span>
                  <span>{room.room_type}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                  {room.title}
                </h1>
                <p className="text-stone-500 text-sm mt-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4 flex-shrink-0 text-stone-400"
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
                  {room.address}, Quận {room.district}, Đà Nẵng
                </p>
              </div>

              {/* Thông số nhanh */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
                <div>
                  <span className="text-xs text-stone-500 block">Giá thuê</span>
                  <span className="text-lg font-bold text-orange-600">
                    {room.price.toLocaleString("vi-VN")}đ
                    <span className="text-xs font-normal text-stone-500">
                      /tháng
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-xs text-stone-500 block">Diện tích</span>
                  <span className="text-lg font-bold text-stone-900">
                    {room.area}{" "}
                    <span className="text-xs font-normal text-stone-500">m²</span>
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-xs text-stone-500 block">Loại hình</span>
                  <span className="text-sm font-semibold text-stone-900 truncate block">
                    {room.room_type || "Phòng trọ / Căn hộ"}
                  </span>
                </div>
              </div>

              {/* Mô tả chi tiết */}
              <div>
                <h2 className="text-base font-bold text-stone-900 mb-3">
                  Mô tả chi tiết
                </h2>
                <div className="text-stone-700 text-sm leading-relaxed whitespace-pre-line space-y-2">
                  {room.description || "Chưa có thông tin mô tả chi tiết."}
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Widget liên hệ (Desktop Sidebar) */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm sticky top-20 space-y-5">
              <div className="border-b border-stone-100 pb-4">
                <p className="text-xs text-stone-500 font-medium uppercase">
                  Tư vấn & Xem phòng
                </p>
                <h3 className="text-base font-bold text-stone-900 mt-0.5">
                  {CONTACT_CONFIG.ownerName}
                </h3>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${CONTACT_CONFIG.phone}`}
                  className="flex items-center justify-center gap-2.5 w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition text-sm"
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
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>Gọi {CONTACT_CONFIG.displayPhone}</span>
                </a>

                <a
                  href={`https://zalo.me/${CONTACT_CONFIG.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition text-sm"
                >
                  <span className="font-bold">Zalo</span>
                  <span>Nhắn tin Zalo ngay</span>
                </a>

                <a
                  href={`https://wa.me/${CONTACT_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition text-sm"
                >
                  <span>WhatsApp</span>
                </a>

                {CONTACT_CONFIG.facebook && (
                  <a
                    href={CONTACT_CONFIG.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition text-sm"
                  >
                    <span>Facebook Messenger</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Thanh Nút Liên Hệ Nhanh - Fixed Bottom cho Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 z-30 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
          <a
            href={`tel:${CONTACT_CONFIG.phone}`}
            className="flex flex-col items-center justify-center py-2 px-1 bg-orange-600 text-white rounded-xl text-xs font-medium active:scale-95 transition"
          >
            <svg
              className="w-5 h-5 mb-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>Gọi điện</span>
          </a>

          <a
            href={`https://zalo.me/${CONTACT_CONFIG.zalo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 px-1 bg-blue-600 text-white rounded-xl text-xs font-medium active:scale-95 transition"
          >
            <span className="font-bold text-sm leading-none mb-1">ZALO</span>
            <span>Nhắn Zalo</span>
          </a>

          <a
            href={`https://wa.me/${CONTACT_CONFIG.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 px-1 bg-emerald-600 text-white rounded-xl text-xs font-medium active:scale-95 transition"
          >
            <span className="font-bold text-xs leading-none mb-1">WA</span>
            <span>WhatsApp</span>
          </a>

          {CONTACT_CONFIG.facebook ? (
            <a
              href={CONTACT_CONFIG.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-2 px-1 bg-slate-800 text-white rounded-xl text-xs font-medium active:scale-95 transition"
            >
              <span className="font-bold text-xs leading-none mb-1">FB</span>
              <span>Facebook</span>
            </a>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 px-1 bg-stone-200 text-stone-500 rounded-xl text-xs font-medium">
              <span>Đà Nẵng</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
