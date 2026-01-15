"use client";

import { useEffect, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { fetchHospitalCategoriesApi } from "@/services/hospital.service";
import { uploadImageApi } from "@/services/category.services";

const API_BASE = "http://localhost:3000";

type HospitalCategory = {
  _id: string;
  hospitalCategory: string;
};

type Timing = {
  days: string;
  time: string;
};

export default function HospitalDetailsStep({
  data,
  onChange,
  onNext,
}: {
  data: any;
  onChange: (val: any) => void;
  onNext: () => void;
}) {
  const [categories, setCategories] = useState<HospitalCategory[]>([]);
  const [uploading, setUploading] = useState(false);

  /* ---------------- FETCH CATEGORY ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchHospitalCategoriesApi();
        setCategories(res.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const res = await uploadImageApi(file);
      return res?.success ? res.file.url : null;
    } catch (error) {
      console.error("Upload failed", error);
      return null;
    } finally {
      setUploading(false);
    }
  };
  /* ---------------- ICON UPLOAD ---------------- */
  const handleIconUpload = async (file?: File) => {
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      onChange({ iconUrl: url });
    }
  };

  /* ---------------- MULTI IMAGE UPLOAD ---------------- */
  const uploadMultipleImages = async (files: File[]) => {
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) {
        onChange({
          imageUrls: [...(data.imageUrls || []), url].slice(0, 10),
        });
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).slice(0, 10);
    await uploadMultipleImages(files);
  };

  const handleBrowse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 10);
    await uploadMultipleImages(files);
  };

  /* ---------------- TIMING ---------------- */
  const timings: Timing[] =
    data?.timings && data?.timings.length > 0
      ? data?.timings
      : [{ days: "", time: "" }];

  const updateTiming = (index: number, key: keyof Timing, value: string) => {
    const updated = [...timings];
    updated[index][key] = value;
    onChange({ timings: updated });
  };

  const addTimingRow = () => {
    onChange({ timings: [...timings, { days: "", time: "" }] });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* ---------------- BASIC DETAILS ---------------- */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1">Hospital Name *</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              value={data?.hospitalName || ""}
              onChange={(e) => onChange({ hospitalName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Hospital Type *</label>
            <select
              className="w-full border px-3 py-2 rounded-md"
              value={data?.hospitalType || ""}
              onChange={(e) => onChange({ hospitalType: e.target.value })}
            >
              <option value="">Select Type</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat?.hospitalCategory}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Contact Number *</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              value={data?.contactNumber || ""}
              onChange={(e) => onChange({ contactNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Whatsapp *</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              value={data?.whatsapp || ""}
              onChange={(e) => onChange({ whatsapp: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Mail ID *</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              value={data?.email || ""}
              onChange={(e) => onChange({ email: e.target.value })}
            />
          </div>

          {/* ICON */}
          <div>
            <label className="block text-sm mb-1">Icon (1:1)*</label>
            <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-md w-max">
              <Upload size={16} />
              Upload Icon
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleIconUpload(e.target.files?.[0])}
              />
            </label>

            {data?.iconUrl && (
              <p className="text-xs mt-1 text-green-600 truncate">
                {data?.iconUrl}
              </p>
            )}
          </div>
        </div>

        {/* ---------------- IMAGE UPLOAD ---------------- */}
        <div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed h-64 rounded-lg flex flex-col items-center justify-center text-center px-4"
          >
            <ImageIcon size={40} className="text-gray-500 mb-3" />
            <p>Drag Images here or</p>
            <label className="text-blue-600 cursor-pointer underline">
              Browse Images
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleBrowse}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">Max 10 images</p>
          </div>

          {data?.imageUrls?.length > 0 && (
            <div className="mt-3 grid grid-cols-1 gap-1">
              {data?.imageUrls?.map((url: string, i: number) => (
                <p key={i} className="text-xs truncate text-green-600">
                  {url}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------------- ADDRESS ---------------- */}
      <h2 className="text-lg font-semibold mt-10 mb-4">Address</h2>

      <div className="grid grid-cols-2 gap-6">
        <input
          placeholder="City"
          className="border px-3 py-2 rounded-md"
          value={data?.city || ""}
          onChange={(e) => onChange({ city: e.target.value })}
        />
        <input
          placeholder="Map Direction"
          className="border px-3 py-2 rounded-md"
          value={data?.mapDirection || ""}
          onChange={(e) => onChange({ mapDirection: e.target.value })}
        />
        <input
          placeholder="Location"
          className="col-span-2 border px-3 py-2 rounded-md"
          value={data?.location || ""}
          onChange={(e) => onChange({ location: e.target.value })}
        />
      </div>

      {/* ---------------- TIMING ---------------- */}
      <div className="mt-10">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Timing</h2>
          <button
            type="button"
            onClick={addTimingRow}
            className="text-green-600 text-sm font-medium"
          >
            + Add Days
          </button>
        </div>

        {timings.map((t, i) => (
          <div key={i} className="grid grid-cols-4 gap-6 mb-3">
            <input
              className="border px-3 py-2 rounded-md"
              placeholder="Ex - Mon-Fri"
              value={t.days}
              onChange={(e) => updateTiming(i, "days", e.target.value)}
            />
            <input
              className="col-span-2 border px-3 py-2 rounded-md"
              placeholder="9:00 AM - 5:00 PM"
              value={t.time}
              onChange={(e) => updateTiming(i, "time", e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* ---------------- NEXT ---------------- */}
      <div className="flex justify-end mt-10">
        <button
          disabled={uploading}
          onClick={onNext}
          className="bg-green-600 text-white px-8 py-2 rounded-md disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
