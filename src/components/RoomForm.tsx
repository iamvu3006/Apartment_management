"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Room, RoomInput, RoomStatus } from "@/types/room";

interface RoomFormProps {
  initialData?: Room; // nếu có -> chế độ sửa, không có -> chế độ thêm mới
}

const emptyForm: RoomInput = {
  title: "",
  price: 0,
  area: 0,
  address: "",
  district: "",
  room_type: "",
  status: "trong",
  description: "",
  images: [],
};

export default function RoomForm({ initialData }: RoomFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(initialData);

  const [form, setForm] = useState<RoomInput>(
    initialData
      ? {
          title: initialData.title,
          price: initialData.price,
          area: initialData.area,
          address: initialData.address,
          district: initialData.district,
          room_type: initialData.room_type,
          status: initialData.status,
          description: initialData.description ?? "",
          images: initialData.images,
        }
      : emptyForm
  );

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange<K extends keyof RoomInput>(key: K, value: RoomInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  }

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  }

  async function uploadImages(): Promise<string[]> {
    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("room-images")
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Lỗi upload ảnh: ${uploadError.message}`);
      }

      const { data } = supabase.storage
        .from("room-images")
        .getPublicUrl(fileName);
      uploadedUrls.push(data.publicUrl);
    }
    return uploadedUrls;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      const newImageUrls = await uploadImages();
      const finalImages = [...existingImages, ...newImageUrls];

      const payload: RoomInput = {
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        images: finalImages,
      };

      if (isEditMode && initialData) {
        const { error: updateError } = await supabase
          .from("rooms")
          .update(payload)
          .eq("id", initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("rooms")
          .insert(payload);
        if (insertError) throw insertError;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Tiêu đề phòng</label>
        <input
          required
          type="text"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="VD: Phòng trọ gác lửng gần cầu Rồng"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Giá thuê (đồng/tháng)</label>
          <input
            required
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Diện tích (m²)</label>
          <input
            required
            type="number"
            min={0}
            value={form.area}
            onChange={(e) => handleChange("area", Number(e.target.value))}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Địa chỉ</label>
        <input
          required
          type="text"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Số nhà, đường..."
          className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Khu vực/Quận</label>
          <input
            required
            type="text"
            value={form.district}
            onChange={(e) => handleChange("district", e.target.value)}
            placeholder="VD: Hải Châu"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Loại phòng</label>
          <input
            required
            type="text"
            value={form.room_type}
            onChange={(e) => handleChange("room_type", e.target.value)}
            placeholder="VD: Chung cư mini"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Trạng thái</label>
        <select
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value as RoomStatus)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="trong">Còn trống</option>
          <option value="da_coc">Đã cọc</option>
          <option value="da_thue">Đã cho thuê</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea
          rows={4}
          value={form.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Tiện ích, giờ giấc, nội thất..."
          className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ảnh phòng</label>

        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {existingImages.map((url) => (
              <div key={url} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Ảnh phòng"
                  className="w-24 h-24 object-cover rounded-lg border border-stone-200"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="w-full text-sm"
        />
        {imageFiles.length > 0 && (
          <p className="text-xs text-stone-500 mt-1">
            {imageFiles.length} ảnh mới sẽ được upload khi lưu
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={uploading}
          className="bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-medium px-5 py-2.5 rounded-lg transition"
        >
          {uploading ? "Đang lưu..." : isEditMode ? "Lưu thay đổi" : "Thêm phòng"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="border border-stone-300 px-5 py-2.5 rounded-lg hover:bg-stone-100 transition"
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}
