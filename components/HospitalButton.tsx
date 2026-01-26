"use client";

import { useEffect, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { fetchHospitalCategoriesApi } from "@/services/hospital.service";
import { uploadImageApi } from "@/services/category.services";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data?.hospitalName?.trim()) {
      newErrors.hospitalName = "Hospital name is required";
    }

    if (!data?.hospitalType) {
      newErrors.hospitalType = "Please select hospital type";
    }

    if (!data?.contactNumber?.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(data.contactNumber)) {
      newErrors.contactNumber = "Enter valid 10 digit number";
    }

    if (!data?.whatsapp?.trim()) {
      newErrors.whatsapp = "Whatsapp number is required";
    }

    if (!data?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!data?.iconUrl) {
      newErrors.iconUrl = "Icon is required";
    }

    if (!data?.city?.trim()) {
      newErrors.city = "City is required";
    }

    if (!data?.location?.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
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

  const handleIconUpload = async (file?: File) => {
    if (!file) return;

    const url = await uploadImage(file);

    if (url) {
      onChange({ iconUrl: url });

      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.iconUrl;
        return copy;
      });
    }
  };

  const uploadMultipleImages = async (files: File[]) => {
    try {
      setUploading(true);
      
      // Upload all files first and collect URLs
      const uploadPromises = files.map(async (file) => {
        try {
          const res = await uploadImageApi(file);
          return res?.success ? res.file.url : null;
        } catch (error) {
          console.error("Upload failed for file", error);
          return null;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => Boolean(url));

      // Update state once with all new URLs
      if (validUrls.length > 0) {
        const currentUrls = data.firstStepImageUrls || [];
        const newUrls = [...currentUrls, ...validUrls].slice(0, 10);
        onChange({ firstStepImageUrls: newUrls });
      }
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
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

  /* ---------------- HANDLE NEXT ---------------- */
  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* ---------------- BASIC DETAILS ---------------- */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 grid grid-cols-2 gap-6">

          {/* Hospital Name */}
          <div>
            <label className="block text-sm mb-1">Hospital Name *</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              value={data?.hospitalName || ""}
              onChange={(e) => onChange({ hospitalName: e.target.value })}
            />
            {errors.hospitalName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.hospitalName}
              </p>
            )}
          </div>

          {/* Hospital Type */}
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
                  {cat.hospitalCategory}
                </option>
              ))}
            </select>

            {errors.hospitalType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.hospitalType}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm mb-1">Contact Number *</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              value={data?.contactNumber || ""}
              onChange={(e) => onChange({ contactNumber: e.target.value })}
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>

          {/* Whatsapp */}
          <div>
            <label className="block text-sm mb-1">Whatsapp *</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              value={data?.whatsapp || ""}
              onChange={(e) => onChange({ whatsapp: e.target.value })}
            />
            {errors.whatsapp && (
              <p className="text-red-500 text-xs mt-1">
                {errors.whatsapp}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Mail ID *</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              value={data?.email || ""}
              onChange={(e) => onChange({ email: e.target.value })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm mb-1">Icon *</label>

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
              <div className="mt-2">
                <img
                  src={data.iconUrl}
                  alt="Icon preview"
                  className="w-20 h-20 object-cover rounded-md border"
                />
              </div>
            )}

            {errors.iconUrl && (
              <p className="text-red-500 text-xs mt-1">
                {errors.iconUrl}
              </p>
            )}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm mb-2">Images</label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center px-4 py-6 min-h-[200px]"
          >
            <ImageIcon size={40} className="text-gray-500 mb-3" />

            <p className="text-sm">Drag Images here or</p>

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

          {/* Image Previews */}
          {data?.firstStepImageUrls && data.firstStepImageUrls.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-2">
                {data.firstStepImageUrls.map((url: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(data.firstStepImageUrls || [])];
                        updated.splice(index, 1);
                        onChange({ firstStepImageUrls: updated });
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Address */}
      <h2 className="text-lg font-semibold mt-10 mb-4">Address</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <input
            placeholder="City"
            className="border px-3 py-2 rounded-md w-full"
            value={data?.city || ""}
            onChange={(e) => onChange({ city: e.target.value })}
          />

          {errors.city && (
            <p className="text-red-500 text-xs mt-1">
              {errors.city}
            </p>
          )}
        </div>

        <input
          placeholder="Map Direction"
          className="border px-3 py-2 rounded-md"
          value={data?.mapDirection || ""}
          onChange={(e) => onChange({ mapDirection: e.target.value })}
        />

        <div className="col-span-2">
          <input
            placeholder="Location"
            className="border px-3 py-2 rounded-md w-full"
            value={data?.location || ""}
            onChange={(e) => onChange({ location: e.target.value })}
          />

          {errors.location && (
            <p className="text-red-500 text-xs mt-1">
              {errors.location}
            </p>
          )}
        </div>
      </div>

      {/* Timing */}
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

        {timings.map((t, i) => {
          // Parse time if it's in "5AM to 5PM" format
          const timeParts = t.time ? t.time.split(" to ") : ["", ""];
          const startTime = timeParts[0] || "";
          const endTime = timeParts[1] || "";

          const handleTimeChange = (start: string, end: string) => {
            const formattedTime = start && end ? `${start} to ${end}` : start || end;
            updateTiming(i, "time", formattedTime);
          };

          return (
            <div key={i} className="grid grid-cols-5 gap-4 mb-3">
              {/* Day Select */}
              <select
                className="border px-3 py-2 rounded-md"
                value={t.days}
                onChange={(e) => updateTiming(i, "days", e.target.value)}
              >
                <option value="">Select Day</option>
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>

              {/* Start Time */}
              <input
                className="border px-3 py-2 rounded-md"
                placeholder="5AM"
                value={startTime}
                onChange={(e) => handleTimeChange(e.target.value, endTime)}
              />

              <span className="flex items-center justify-center text-gray-500">to</span>

              {/* End Time */}
              <input
                className="border px-3 py-2 rounded-md"
                placeholder="5PM"
                value={endTime}
                onChange={(e) => handleTimeChange(startTime, e.target.value)}
              />

              {/* Remove Button */}
              {timings.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...timings];
                    updated.splice(i, 1);
                    onChange({ timings: updated });
                  }}
                  className="text-red-600 text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Next */}
      <div className="flex justify-end mt-10">
        <button
          disabled={uploading}
          onClick={handleNext}
          className="bg-green-600 text-white px-8 py-2 rounded-md disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
