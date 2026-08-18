"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
  district?: string;
  onChange: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER: [number, number] = [16.0600, 108.2250]; // Da Nang Dragon Bridge

export default function LocationPicker({
  latitude,
  longitude,
  address,
  district,
  onChange,
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [searching, setSearching] = useState(false);
  const [searchMsg, setSearchMsg] = useState<string | null>(null);

  const initialLat = latitude && !isNaN(Number(latitude)) ? Number(latitude) : DEFAULT_CENTER[0];
  const initialLng = longitude && !isNaN(Number(longitude)) ? Number(longitude) : DEFAULT_CENTER[1];

  const [coords, setCoords] = useState<[number, number]>([initialLat, initialLng]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Custom marker icon
    const customIcon = L.divIcon({
      className: "custom-location-pin",
      html: `
        <div style="
          width: 36px;
          height: 36px;
          background: #0284c7;
          border: 3px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background: #ffffff;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: true,
    });

    // High quality CartoDB Voyager tiles
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    // Add draggable marker
    const marker = L.marker([initialLat, initialLng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    markerRef.current = marker;
    mapRef.current = map;

    // Handle marker dragend
    marker.on("dragend", () => {
      const position = marker.getLatLng();
      const newLat = Number(position.lat.toFixed(6));
      const newLng = Number(position.lng.toFixed(6));
      setCoords([newLat, newLng]);
      onChange(newLat, newLng);
    });

    // Handle map click
    map.on("click", (e: L.LeafletMouseEvent) => {
      const newLat = Number(e.latlng.lat.toFixed(6));
      const newLng = Number(e.latlng.lng.toFixed(6));
      marker.setLatLng([newLat, newLng]);
      setCoords([newLat, newLng]);
      onChange(newLat, newLng);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker position if props change externally
  useEffect(() => {
    if (latitude && longitude && !isNaN(Number(latitude)) && !isNaN(Number(longitude))) {
      const lat = Number(latitude);
      const lng = Number(longitude);
      setCoords([lat, lng]);
      if (markerRef.current && mapRef.current) {
        markerRef.current.setLatLng([lat, lng]);
        mapRef.current.setView([lat, lng], 16);
      }
    }
  }, [latitude, longitude]);

  // Geocode address helper button
  async function searchLocationOnMap() {
    const queryStr = [address, district, "Đà Nẵng", "Việt Nam"]
      .filter(Boolean)
      .join(", ");

    if (!queryStr.trim()) {
      setSearchMsg("Please enter street address or district first.");
      return;
    }

    setSearching(true);
    setSearchMsg(null);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          queryStr
        )}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "DaNangHomes/1.0",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = Number(parseFloat(data[0].lat).toFixed(6));
          const lng = Number(parseFloat(data[0].lon).toFixed(6));

          setCoords([lat, lng]);
          onChange(lat, lng);

          if (markerRef.current && mapRef.current) {
            markerRef.current.setLatLng([lat, lng]);
            mapRef.current.setView([lat, lng], 16);
          }
          setSearchMsg("✓ Found location suggestion! Drag marker to fine-tune building pin.");
        } else {
          setSearchMsg("Could not locate exact street. Click directly on map to set pin.");
        }
      }
    } catch {
      setSearchMsg("Search service unavailable. Click directly on map to set pin.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-sm font-semibold text-slate-700">
          Exact Property Location on Map (Pin)
        </label>
        <button
          type="button"
          onClick={searchLocationOnMap}
          disabled={searching}
          className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold px-3 py-1.5 rounded-lg border border-sky-200 transition flex items-center gap-1 active:scale-95"
        >
          {searching ? (
            <span>Locating...</span>
          ) : (
            <>
              <span>🔍 Auto-Suggest Pin from Address</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Click anywhere on the map or drag the blue pin to set the exact building location for map view.
      </p>

      {searchMsg && (
        <div className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
          {searchMsg}
        </div>
      )}

      {/* Map Box */}
      <div className="relative w-full h-64 rounded-xl border border-slate-300 overflow-hidden shadow-sm">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        <div className="absolute bottom-2 left-2 z-20 bg-slate-900/80 text-white text-[11px] font-mono px-2.5 py-1 rounded-md backdrop-blur-sm shadow">
          Lat: {coords[0]} | Lng: {coords[1]}
        </div>
      </div>
    </div>
  );
}
