"use client";

import { useEffect, useState } from "react";
import { Upload, ImageIcon, Plus, Trash2 } from "lucide-react";
import { fetchHospitalCategoriesApi } from "@/services/hospital.service";
import { uploadImageApi } from "@/services/category.services";
import Input from "@/components/Input";
import Button from "@/components/Button";

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
        setCategories(res?.data ?? []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data?.hospitalName?.trim()) newErrors.hospitalName = "Hospital name is required";
    if (!data?.hospitalType) newErrors.hospitalType = "Please select hospital type";

    if (!data?.contactNumber?.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(data.contactNumber)) {
      newErrors.contactNumber = "Enter valid 10 digit number";
    }

    if (!data?.whatsapp?.trim()) newErrors.whatsapp = "Whatsapp number is required";

    if (!data?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!data?.iconUrl) newErrors.iconUrl = "Icon is required";
    if (!data?.city?.trim()) newErrors.city = "City is required";
    if (!data?.location?.trim()) newErrors.location = "Location is required";

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
  const timings: Timing[] = data?.timings && data?.timings.length > 0 ? data?.timings : [{ days: "", time: "" }];

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
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* ---------------- BASIC DETAILS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Hospital Name *"
            value={data?.hospitalName || ""}
            onChange={(e) => onChange({ hospitalName: e.target.value })}
            error={errors.hospitalName}
            placeholder="Enter hospital name"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Hospital Type *</label>
            <select
              className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${errors.hospitalType ? "border-destructive" : ""}`}
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
            {errors.hospitalType && <p className="text-xs font-medium text-destructive">{errors.hospitalType}</p>}
          </div>

          <Input
            label="Contact Number *"
            value={data?.contactNumber || ""}
            onChange={(e) => onChange({ contactNumber: e.target.value })}
            error={errors.contactNumber}
            placeholder="Enter contact number"
          />

          <Input
            label="Whatsapp *"
            value={data?.whatsapp || ""}
            onChange={(e) => onChange({ whatsapp: e.target.value })}
            error={errors.whatsapp}
            placeholder="Enter whatsapp number"
          />

          <Input
            label="Mail ID *"
            value={data?.email || ""}
            onChange={(e) => onChange({ email: e.target.value })}
            error={errors.email}
            placeholder="Enter email address"
          />

          {/* Icon Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Icon *</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer border border-input bg-card hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition-colors text-sm font-medium shadow-sm">
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
                <img
                  src={data.iconUrl}
                  alt="Icon preview"
                  className="w-10 h-10 object-cover rounded-md border border-border"
                />
              )}
            </div>
            {errors.iconUrl && <p className="text-xs font-medium text-destructive">{errors.iconUrl}</p>}
          </div>
        </div>

        {/* Images Upload Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Images</label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center text-center px-4 py-8 bg-muted/5 transition-colors"
          >
            <ImageIcon size={32} className="text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Drag images here</p>
            <p className="text-xs text-muted-foreground mb-3">or click to browse</p>

            <label className="cursor-pointer">
              <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('image-upload')?.click()}>Browse Files</Button>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleBrowse}
              />
            </label>
            <p className="text-xs text-muted-foreground mt-2">Max 10 images</p>
          </div>

          {/* Image Previews */}
          {data?.firstStepImageUrls && data.firstStepImageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {data.firstStepImageUrls.map((url: string, index: number) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-md border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(data.firstStepImageUrls || [])];
                      updated.splice(index, 1);
                      onChange({ firstStepImageUrls: updated });
                    }}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------------- ADDRESS ---------------- */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            placeholder="City"
            value={data?.city || ""}
            onChange={(e) => onChange({ city: e.target.value })}
            error={errors.city}
          />
          <Input
            placeholder="Map Direction URL"
            value={data?.mapDirection || ""}
            onChange={(e) => onChange({ mapDirection: e.target.value })}
          />
          <div className="md:col-span-2">
            <Input
              placeholder="Full Location Address"
              value={data?.location || ""}
              onChange={(e) => onChange({ location: e.target.value })}
              error={errors.location}
            />
          </div>
        </div>
      </div>

      {/* ---------------- TIMING ---------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Timing</h2>
          <Button type="button" variant="outline" size="sm" onClick={addTimingRow} className="gap-2">
            <Plus size={16} /> Add Days
          </Button>
        </div>

        <div className="space-y-3">
          {timings.map((t, i) => {
            const timeParts = t.time ? t.time.split(" to ") : ["", ""];
            const startTime = timeParts[0] || "";
            const endTime = timeParts[1] || "";

            const handleTimeChange = (start: string, end: string) => {
              const formattedTime = start && end ? `${start} to ${end}` : start || end;
              updateTiming(i, "time", formattedTime);
            };

            return (
              <div key={i} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-card p-4 rounded-lg border border-border shadow-sm">
                <select
                  className="flex h-9 w-full md:w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={t.days}
                  onChange={(e) => updateTiming(i, "days", e.target.value)}
                >
                  <option value="">Select Day</option>
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Input
                    className="w-full md:w-32"
                    placeholder="9:00 AM"
                    value={startTime}
                    onChange={(e) => handleTimeChange(e.target.value, endTime)}
                  />
                  <span className="text-muted-foreground text-sm">to</span>
                  <Input
                    className="w-full md:w-32"
                    placeholder="5:00 PM"
                    value={endTime}
                    onChange={(e) => handleTimeChange(startTime, e.target.value)}
                  />
                </div>

                {timings.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const updated = [...timings];
                      updated.splice(i, 1);
                      onChange({ timings: updated });
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto md:ml-0"
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- NEXT ---------------- */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          isLoading={uploading}
          disabled={uploading}
          className="w-full md:w-auto"
          size="lg"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
