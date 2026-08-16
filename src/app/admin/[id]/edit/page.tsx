"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Room } from "@/types/room";
import RoomForm from "@/components/RoomForm";

export default function EditRoomPage() {
  const params = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoom() {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setRoom(data as Room);
      }
      setLoading(false);
    }
    fetchRoom();
  }, [params.id]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8">Sửa thông tin phòng</h1>

      {loading && <p className="text-stone-500">Đang tải...</p>}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
          Lỗi: {error}
        </div>
      )}

      {room && <RoomForm initialData={room} />}
    </div>
  );
}
