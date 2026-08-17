"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Room, STATUS_LABELS, STATUS_COLORS } from "@/types/room";
import RoomFilter, { FilterState } from "@/components/RoomFilter";
import { CONTACT_CONFIG } from "@/config/contact";
import { useApp, LANGUAGES, Language } from "@/context/AppContext";

const initialFilters: FilterState = {
  search: "",
  district: "all",
  priceRange: "all",
  minPrice: "",
  maxPrice: "",
  roomType: "all",
  status: "all",
};

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const {
    currency,
    toggleCurrency,
    language,
    setLanguage,
    t,
    formatPrice,
    isFavorite,
    toggleFavorite,
    favorites,
  } = useApp();

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
      // 1. Keyword search
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const titleMatch = room.title?.toLowerCase().includes(q);
        const addressMatch = room.address?.toLowerCase().includes(q);
        if (!titleMatch && !addressMatch) return false;
      }

      // 2. District filter
      if (filters.district !== "all") {
        const roomDist = room.district?.trim().toLowerCase() || "";
        const filterDist = filters.district.trim().toLowerCase();
        if (!roomDist.includes(filterDist) && !filterDist.includes(roomDist)) {
          return false;
        }
      }

      // 3. Price filtering (Custom Min/Max + Preset Ranges)
      const p = Number(room.price);

      // Custom Min Price
      if (filters.minPrice !== "") {
        const min = Number(filters.minPrice);
        if (!isNaN(min) && p < min) return false;
      }

      // Custom Max Price
      if (filters.maxPrice !== "") {
        const max = Number(filters.maxPrice);
        if (!isNaN(max) && p > max) return false;
      }

      // Preset Price Ranges
      if (filters.priceRange !== "all") {
        if (filters.priceRange === "7m_10m" && (p < 7000000 || p > 10000000))
          return false;
        if (
          filters.priceRange === "10m_13m" &&
          (p < 10000000 || p > 13000000)
        )
          return false;
        if (
          filters.priceRange === "13m_15m" &&
          (p < 13000000 || p > 15000000)
        )
          return false;
        if (
          filters.priceRange === "15m_20m" &&
          (p < 15000000 || p > 20000000)
        )
          return false;
        if (filters.priceRange === "over_20m" && p <= 20000000) return false;
      }

      // 4. Property type filter
      if (filters.roomType !== "all") {
        if (
          room.room_type?.trim().toLowerCase() !==
          filters.roomType.trim().toLowerCase()
        ) {
          return false;
        }
      }

      // 5. Availability status filter
      if (filters.status !== "all") {
        if (room.status !== filters.status) return false;
      }

      return true;
    });
  }, [rooms, filters]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / ITEMS_PER_PAGE));

  const paginatedRooms = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRooms.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredRooms, currentPage]);

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const element = document.getElementById("listings-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header Top Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-sky-400 transition">
              DN
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

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Dropdown */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-bold focus:outline-none transition cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>

            {/* Currency Switcher Button */}
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 font-bold transition"
              title="Toggle currency between VND and USD"
            >
              <span>{currency === "VND" ? "🇻🇳 ₫ VND" : "🇺🇸 $ USD"}</span>
            </button>

            {/* Saved Favorites Link */}
            <Link
              href="/saved"
              className="relative text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 font-semibold transition flex items-center gap-1"
            >
              <span>❤️ {t.saved}</span>
              {favorites.length > 0 && (
                <span className="w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              href="/admin"
              className="text-xs bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 rounded-lg font-bold transition shadow-sm"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            Verified long-term & short-term rentals in Da Nang
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Find Your Ideal Apartment & Studio in Da Nang
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            100% real photos • Transparent pricing • Fast English-speaking local assistance for expats & digital nomads.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative bg-white rounded-2xl p-2 shadow-xl flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-slate-900 text-sm focus:outline-none placeholder:text-slate-400 font-medium"
                />
                <svg
                  className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
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
              </div>

              {filters.search && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, search: "" }))
                  }
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <span className="text-slate-500 font-medium">Quick search:</span>
            {["Hải Châu", "Sơn Trà", "Hòa Cường", "Studio"].map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, search: tag }))
                }
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-[11px]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 pb-16 flex-1 relative z-20 w-full">
        {/* Component Filter */}
        {!loading && (
          <RoomFilter
            rooms={rooms}
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters(initialFilters)}
          />
        )}

        {/* Loading state */}
        {loading && (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Loading rental listings...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredRooms.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-slate-900 font-bold text-base mb-1">
              No matching properties found
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-5">
              Try searching with different keywords or reset your filters.
            </p>
            <button
              onClick={() => setFilters(initialFilters)}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Results Counter & Property Grid */}
        {!loading && filteredRooms.length > 0 && (
          <div id="listings-section" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                Showing{" "}
                <span className="text-sky-600 font-bold">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredRooms.length)}
                </span>{" "}
                of{" "}
                <span className="text-slate-900 font-bold">
                  {filteredRooms.length}
                </span>{" "}
                available properties
              </p>
            </div>

            {/* Property Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedRooms.map((room) => {
                const isFav = isFavorite(room.id);
                return (
                  <div
                    key={room.id}
                    className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-250 flex flex-col group relative"
                  >
                    {/* Thumbnail Image Container */}
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

                      {/* Favorite Heart Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(room.id);
                        }}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow transition ${
                          isFav
                            ? "bg-rose-500 text-white scale-110"
                            : "bg-slate-900/60 hover:bg-slate-900/80 text-white/80"
                        }`}
                        title={isFav ? "Remove from saved" : "Save to favorites"}
                      >
                        ❤️
                      </button>

                      {/* Specs Pill */}
                      <div className="absolute bottom-3 right-3 bg-slate-900/75 text-white text-[11px] px-2.5 py-1 rounded-lg backdrop-blur-md font-medium">
                        {room.area} m²
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Sub-header: District & Property Type */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          <span>{room.district}</span>
                          {room.room_type && (
                            <>
                              <span>•</span>
                              <span className="text-sky-600">{room.room_type}</span>
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <Link href={`/phong/${room.id}`}>
                          <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-600 transition line-clamp-2 leading-snug">
                            {room.title}
                          </h3>
                        </Link>

                        {/* Address */}
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

                      {/* Price & CTA */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                            {t.monthlyRent}
                          </span>
                          <span className="text-base sm:text-lg font-extrabold text-rose-600">
                            {formatPrice(room.price, "/mo")}
                          </span>
                        </div>

                        <Link
                          href={`/phong/${room.id}`}
                          className="text-xs text-sky-600 group-hover:text-sky-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition"
                        >
                          {t.viewDetails}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">
                  Page <span className="font-bold text-slate-900">{currentPage}</span> of{" "}
                  <span className="font-bold text-slate-900">{totalPages}</span>
                </p>

                <div className="flex items-center gap-1.5">
                  {/* Prev Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition flex items-center gap-1"
                  >
                    ← Prev
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-extrabold transition ${
                        currentPage === pageNum
                          ? "bg-sky-600 text-white shadow-sm"
                          : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition flex items-center gap-1"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-sm">
                DN
              </div>
              <span className="font-bold text-white text-base">
                DA NANG HOMES
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Trusted long-term & short-term room and apartment rental consultant for expats, foreigners, and locals in Da Nang.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">
              Direct Contact Specialists
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-200 font-bold block">{CONTACT_CONFIG.primary.name}</span>
                <span className="text-slate-400">Hotline/Zalo/WhatsApp: </span>
                <a
                  href={`tel:${CONTACT_CONFIG.primary.phone}`}
                  className="text-sky-400 underline font-semibold"
                >
                  {CONTACT_CONFIG.primary.displayPhone}
                </a>
              </div>
              <div>
                <span className="text-slate-200 font-bold block">{CONTACT_CONFIG.secondary.name}</span>
                <span className="text-slate-400">Hotline/Zalo/WhatsApp: </span>
                <a
                  href={`tel:${CONTACT_CONFIG.secondary.phone}`}
                  className="text-emerald-400 underline font-semibold"
                >
                  {CONTACT_CONFIG.secondary.displayPhone}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">
              Service Areas
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Son Tra • Hai Chau • Ngu Hanh Son • Thanh Khe • Lien Chieu • Cam Le
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Da Nang Homes. All room information verified.
        </div>
      </footer>
    </div>
  );
}
