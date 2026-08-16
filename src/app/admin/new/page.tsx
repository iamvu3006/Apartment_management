import RoomForm from "@/components/RoomForm";

export default function NewRoomPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8">Thêm phòng mới</h1>
      <RoomForm />
    </div>
  );
}
