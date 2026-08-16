"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Room } from "@/types/room";
import { useApp } from "@/context/AppContext";

interface RoomMapInnerProps {
  rooms: Room[];
}

// Coordinate mapping for Da Nang areas & streets
function getRoomCoordinates(room: Room): [number, number] {
  const addr = (room.address + " " + room.district + " " + room.title).toLowerCase();

  if (addr.includes("pham kiet")) {
    return [16.0352 + (Math.random() - 0.5) * 0.002, 108.2435 + (Math.random() - 0.5) * 0.002];
  }
  if (addr.includes("an my 7") || addr.includes("an mỹ 7")) {
    return [16.0598 + (Math.random() - 0.5) * 0.002, 108.2318 + (Math.random() - 0.5) * 0.002];
  }
  if (addr.includes("phuoc my") || addr.includes("phước mỹ")) {
    return [16.0580 + (Math.random() - 0.5) * 0.003, 108.2420 + (Math.random() - 0.5) * 0.003];
  }
  if (addr.includes("son tra") || addr.includes("sơn trà")) {
    return [16.0680 + (Math.random() - 0.5) * 0.005, 108.2380 + (Math.random() - 0.5) * 0.005];
  }
  if (addr.includes("ngu hanh son") || addr.includes("ngũ hành sơn")) {
    return [16.0380 + (Math.random() - 0.5) * 0.005, 108.2440 + (Math.random() - 0.5) * 0.005];
  }
  if (addr.includes("hai chau") || addr.includes("hải châu")) {
    return [16.0600 + (Math.random() - 0.5) * 0.005, 108.2150 + (Math.random() - 0.5) * 0.005];
  }
  if (addr.includes("thanh khe") || addr.includes("thanh khê")) {
    return [16.0630 + (Math.random() - 0.5) * 0.005, 108.1950 + (Math.random() - 0.5) * 0.005];
  }

  // Default Da Nang center fallback with slight offset per room
  return [16.0544 + (Math.random() - 0.5) * 0.01, 108.2208 + (Math.random() - 0.5) * 0.01];
}

export default function RoomMapInner({ rooms }: RoomMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { currency, formatPrice, t } = useApp();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map with standard OpenStreetMap tiles (showing full amenities & details)
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

    // Add price pin markers for each room
    rooms.forEach((room) => {
      const coords = getRoomCoordinates(room);
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
