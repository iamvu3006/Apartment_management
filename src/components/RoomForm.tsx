"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Room, RoomInput, RoomStatus } from "@/types/room";

interface RoomFormProps {
  initialData?: Room;
}

export const DANANG_DISTRICTS = [
  "Son Tra",
  "Hai Chau",
  "Ngu Hanh Son",
  "Thanh Khe",
  "Lien Chieu",
  "Cam Le",
  "Hoa Vang",
  "Son Tra - Phuoc My",
  "Son Tra - An Hai Bac",
  "Son Tra - An Hai Tay",
  "Son Tra - An Hai Dong",
  "Son Tra - Tho Quang",
  "Son Tra - Nai Hien Dong",
  "Son Tra - Man Thai",
  "Ngu Hanh Son - My An",
  "Ngu Hanh Son - Khue My",
  "Ngu Hanh Son - Hoa Hai",
  "Hai Chau - Thach Thang",
  "Hai Chau - Hoa Cuong Bac",
  "Hai Chau - Hoa Cuong Nam",
  "Hai Chau - Binh Thuan",
  "Hai Chau - Phuoc Ninh",
  "Thanh Khe - Xuan Ha",
  "Thanh Khe - Chinh Gian",
  "Thanh Khe - An Khe",
];

export const PROPERTY_TYPES = [
  "Studio",
  "1-Bedroom Apartment",
  "2-Bedroom Apartment",
  "Penthouse",
];

const emptyForm: RoomInput = {
  title: "",
  price: 0,
  area: 0,
  address: "",
  district: "Son Tra",
  room_type: "Studio",
  status: "trong",
  description: "",
  images: [],
};

// Format numeric value with dot thousands separator (e.g. 15.000.000)
function formatNumberWithDots(val: number | string): string {
  if (!val && val !== 0) return "";
  const clean = String(val).replace(/\D/g, "");
  if (!clean) return "";
  return Number(clean).toLocaleString("vi-VN");
}

function parseDotsToNumber(val: string): number {
  const clean = val.replace(/\D/g, "");
  return clean ? Number(clean) : 0;
}

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
          district: initialData.district || "Son Tra",
          room_type: initialData.room_type || "Studio",
          status: initialData.status,
          description: initialData.description ?? "",
          images: initialData.images,
        }
      : emptyForm
  );

  // State to hold formatted price string with dots (e.g. "15.000.000")
  const [formattedPrice, setFormattedPrice] = useState<string>(
    initialData ? formatNumberWithDots(initialData.price) : ""
  );

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData?.price) {
      setFormattedPrice(formatNumberWithDots(initialData.price));
    }
  }, [initialData]);

  function handleChange<K extends keyof RoomInput>(key: K, value: RoomInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePriceInput(e: React.ChangeEvent<HTMLInputElement>) {
    const rawVal = e.target.value;
    const num = parseDotsToNumber(rawVal);
    setFormattedPrice(formatNumberWithDots(num));
    handleChange("price", num);
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
        throw new Error(`Image upload failed: ${uploadError.message}`);
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
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {error && (
        <div className="bg-rose-50 text-rose-700 border border-rose-200 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Listing Title
        </label>
        <input
          required
          type="text"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., Modern Studio Apartment near Dragon Bridge"
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Monthly Rent (VND)
          </label>
          <div className="relative">
            <input
              required
              type="text"
              value={formattedPrice}
              onChange={handlePriceInput}
              placeholder="e.g. 15.000.000"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-semibold text-rose-600"
            />
            {form.price > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                VND
              </span>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Area (m²)
          </label>
          <input
            required
            type="number"
            min={0}
            value={form.area}
            onChange={(e) => handleChange("area", Number(e.target.value))}
            placeholder="e.g. 35"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Street Address
        </label>
        <input
          required
          type="text"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Street number, street name..."
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            District
          </label>
          <select
            value={form.district}
            onChange={(e) => handleChange("district", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-medium"
          >
            {DANANG_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Property Type
          </label>
          <select
            value={form.room_type}
            onChange={(e) => handleChange("room_type", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-medium"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Availability Status
        </label>
        <select
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value as RoomStatus)}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-medium"
        >
          <option value="trong">Available</option>
          <option value="da_coc">Reserved</option>
          <option value="da_thue">Rented</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Description
        </label>
        <textarea
          rows={4}
          value={form.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Amenities, policies, furniture, balcony..."
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Property Photos
        </label>

        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {existingImages.map((url) => (
              <div key={url} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Property photo"
                  className="w-24 h-24 object-cover rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold shadow"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition text-xs shadow-sm active:scale-95">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Choose Property Photos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          {imageFiles.length > 0 ? (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {imageFiles.length} photo(s) selected
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              No new files chosen
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={uploading}
          className="bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition text-sm"
        >
          {uploading ? "Saving..." : isEditMode ? "Save Changes" : "Add Property"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="border border-slate-300 px-5 py-2.5 rounded-xl hover:bg-slate-100 transition text-sm font-semibold text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
