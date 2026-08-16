"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Room } from "@/types/room";
import { useApp } from "@/context/AppContext";

interface RoomMapInnerProps {
  rooms: Room[];
}

// Accurate coordinate mapping for Da Nang streets & districts
function getRoomCoordinates(room: Room, index: number = 0): [number, number] {
  const text = (room.address + " " + room.title + " " + room.district).toLowerCase();

  // Deterministic micro-offset (~15 meters) so multiple units in the same building don't overlap completely
  const offsetLat = ((index % 3) - 1) * 0.00018;
  const offsetLng = Math.floor(index / 3) * 0.0002 - 0.0001;

  // 1. Exact match for An Mỹ 7 (Son Tra, next to Dragon Bridge)
  if (text.includes("an my 7") || text.includes("an mỹ 7") || text.includes("an my") || text.includes("an mỹ")) {
    return [16.0625 + offsetLat, 108.2312 + offsetLng];
  }

  // 2. Exact match for Phạm Kiệt (Ngu Hanh Son, near beach)
  if (text.includes("pham kiet") || text.includes("phạm kiệt")) {
    return [16.0352 + offsetLat, 108.2435 + offsetLng];
  }

  // 3. Phước Mỹ (Son Tra beach area)
  if (text.includes("phuoc my") || text.includes("phước mỹ")) {
    return [16.0590 + offsetLat, 108.2420 + offsetLng];
  }

  // 4. Mỹ An / An Thượng (Ngu Hanh Son Expat quarter)
  if (text.includes("my an") || text.includes("mỹ an") || text.includes("an thuong") || text.includes("an thượng")) {
    return [16.0480 + offsetLat, 108.2420 + offsetLng];
  }

  // 5. General Son Tra district (near Dragon Bridge / Vo Van Kiet)
  if (text.includes("son tra") || text.includes("sơn trà")) {
    return [16.0620 + offsetLat, 108.2350 + offsetLng];
  }

  // 6. General Ngu Hanh Son district
  if (text.includes("ngu hanh son") || text.includes("ngũ hành sơn")) {
    return [16.0380 + offsetLat, 108.2430 + offsetLng];
  }

  // 7. General Hai Chau district (Downtown / Bach Dang)
  if (text.includes("hai chau") || text.includes("hải châu")) {
    return [16.0610 + offsetLat, 108.2220 + offsetLng];
  }

  // 8. General Thanh Khe district
  if (text.includes("thanh khe") || text.includes("thanh khê")) {
    return [16.0630 + offsetLat, 108.1980 + offsetLng];
  }

  // Fallback: Da Nang Dragon Bridge center
  return [16.0600 + offsetLat, 108.2250 + offsetLng];
}

export default function RoomMapInner({ rooms }: RoomMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { currency, formatPrice, t } = useApp();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map with standard OpenStreetMap tiles
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [16.0544, 108.2300], // Da Nang Dragon Bridge center
        zoom: 14,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const markersBounds: [number, number][] = [];

    // Add accurate price pin markers for each room
    rooms.forEach((room, index) => {
      const coords = getRoomCoordinates(room, index);
      markersBounds.push(coords);

      const priceText =
        currency === "USD"
          ? `$${Math.round(room.price / 25000)}`
          : `${(room.price / 1000000).toFixed(1)}M`;

      const markerHtml = `
        <div class="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-2.5 py-1 rounded-full shadow-md text-xs border-2 border-white flex items-center gap-1 cursor-pointer transform hover:scale-110 transition">
          <span>${priceText}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-price-pin",
        iconSize: [60, 28],
        iconAnchor: [30, 14],
      });

      const popupContent = `
        <div style="width: 220px; font-family: sans-serif;">
          ${
            room.images[0]
              ? `<img src="${room.images[0]}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />`
              : ""
          }
          <div style="font-size: 11px; font-weight: bold; color: #0284c7; text-transform: uppercase;">${room.district} ${t.district}</div>
          <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-top: 2px; line-clamp: 2;">${room.title}</div>
          <div style="font-size: 14px; font-weight: 800; color: #e11d48; margin-top: 4px;">${formatPrice(room.price, "/mo")}</div>
          <a href="/phong/${room.id}" style="display: block; width: 100%; text-align: center; background: #0284c7; color: white; padding: 6px 0; border-radius: 6px; font-size: 12px; font-weight: bold; margin-top: 8px; text-decoration: none;">${t.viewDetails}</a>
        </div>
      `;

      L.marker(coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent, { maxWidth: 240 });
    });

    if (markersBounds.length > 0) {
      map.fitBounds(markersBounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [rooms, currency, formatPrice, t]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm z-10">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
