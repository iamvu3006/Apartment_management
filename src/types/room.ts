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

// Dữ liệu dùng khi tạo/sửa phòng (chưa có id, created_at)
export type RoomInput = Omit<Room, "id" | "created_at">;

export const STATUS_LABELS: Record<RoomStatus, string> = {
  trong: "Còn trống",
  da_coc: "Đã cọc",
  da_thue: "Đã cho thuê",
};

export const STATUS_COLORS: Record<RoomStatus, string> = {
  trong: "bg-emerald-100 text-emerald-700",
  da_coc: "bg-amber-100 text-amber-700",
  da_thue: "bg-slate-200 text-slate-600",
};
