"use client";

import dynamic from "next/dynamic";
import { Room } from "@/types/room";

const RoomMapInner = dynamic(() => import("./RoomMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-500">
      <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-semibold">Loading Da Nang Interactive Map...</p>
    </div>
  ),
});

interface RoomMapProps {
  rooms: Room[];
}

export default function RoomMap({ rooms }: RoomMapProps) {
  return <RoomMapInner rooms={rooms} />;
}
