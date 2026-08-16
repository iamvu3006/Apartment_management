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
  trong: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium",
  da_coc: "bg-amber-50 text-amber-700 border border-amber-200/60 font-medium",
  da_thue: "bg-slate-100 text-slate-600 border border-slate-200 font-medium",
};
