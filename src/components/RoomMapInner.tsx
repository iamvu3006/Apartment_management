"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Room } from "@/types/room";
import { useApp } from "@/context/AppContext";
import { geocodeAddress } from "@/lib/geocoding";

interface RoomMapInnerProps {
  rooms: Room[];
}

export default function RoomMapInner({ rooms }: RoomMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { currency, formatPrice, t } = useApp();
  const [coordsMap, setCoordsMap] = useState<Record<string, [number, number]>>({});

  // 1. Resolve room coordinates: Prioritize DB stored latitude & longitude
  useEffect(() => {
    let isMounted = true;

    async function resolveCoordinates() {
      const newMap: Record<string, [number, number]> = {};

      for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        if (
          room.latitude &&
          room.longitude &&
          !isNaN(Number(room.latitude)) &&
          !isNaN(Number(room.longitude))
        ) {
          newMap[room.id] = [Number(room.latitude), Number(room.longitude)];
        } else {
          const coords = await geocodeAddress(
            room.address || room.title,
            room.district,
            i
          );
          newMap[room.id] = coords;
        }
      }

      if (isMounted) {
        setCoordsMap(newMap);
      }
    }

    resolveCoordinates();

    return () => {
      isMounted = false;
    };
  }, [rooms]);

  // 2. Render Leaflet Map & Price Pin Markers
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map with CartoDB Voyager tiles
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [16.0544, 108.2300], // Da Nang center
        zoom: 14,
        scrollWheelZoom: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

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

    // Add geocoded price pin markers for each room
    rooms.forEach((room) => {
      const coords = coordsMap[room.id];
      if (!coords) return;

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
  }, [rooms, coordsMap, currency, formatPrice, t]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm z-10">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
