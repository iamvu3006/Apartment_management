export type RoomStatus = "trong" | "da_coc" | "da_thue";

export interface Room {
  id: string;
  title: string;
  price: number;
  area: number;
  address: string;
  district: string;
  room_type: string;
  status: RoomStatus;
  description: string | null;
  images: string[];
  created_at: string;
}

// Data input used when creating/editing a room
export type RoomInput = Omit<Room, "id" | "created_at">;

export const STATUS_LABELS: Record<RoomStatus, string> = {
  trong: "Available",
  da_coc: "Reserved",
  da_thue: "Rented",
};

export const STATUS_COLORS: Record<RoomStatus, string> = {
  trong: "bg-emerald-600 text-white font-extrabold shadow-sm",
  da_coc: "bg-amber-400 text-slate-950 font-extrabold shadow-sm",
  da_thue: "bg-rose-600 text-white font-extrabold shadow-sm",
};
