"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import {
  createCategoryApi,
  uploadImageApi,
} from "@/services/category.services";
import { useRouter } from "next/navigation";

interface Errors {
  categoryName?: string;
  labelName?: string;
  icon?: string;
  images?: string;
}

export default function AddCategoryPage() {
  const router = useRouter();

  const [icon, setIcon] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [categoryName, setCategoryName] = useState("");
  // const [labelName, setLabelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<boolean>(true);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  // ---------- IMAGE HANDLERS ----------
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setImages([...images, ...files].slice(0, 10));
    setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages([...images, ...files].slice(0, 10));
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
  };

  // ---------- VALIDATION ----------
  const validateForm = () => {
    const newErrors: Errors = {};

    if (!categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    }

    if (!icon) {
      newErrors.icon = "Icon image is required";
    }

    if (images.length === 0) {
      newErrors.images = "At least one category image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const iconRes = await uploadImageApi(icon as File);
      const imageRes = await uploadImageApi(images[0]);

      const payload = {
        categoryName,
        imageUrl: imageRes.file.url,
        iconImage: iconRes.file.url,
        status: status,
      };

      await createCategoryApi(payload);
      showToast("category is created Successfully", "success");
      setCategoryName("");
      setImages([]);
      setIcon(null);
      setErrors({});
      router.push("/category/list");
    } catch (error) {
      console.error("Create category error:", error);
      showToast("Error creating category", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Add New Category</h1>

      <div className="grid grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="col-span-2 space-y-6">
          {/* CATEGORY NAME */}
          <div>
            <div className="flex justify-between">
              <label className="w-1/4 text-sm font-medium">
                Category Name *
              </label>
              <input
                className={`w-3/4 border px-3 py-2 rounded-md ${
                  errors.categoryName ? "border-red-500" : ""
                }`}
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    categoryName: undefined,
                  }));
                }}
              />
            </div>
            {errors.categoryName && (
              <p className="text-red-500 text-sm mt-1 ml-[25%]">
                {errors.categoryName}
              </p>
            )}
          </div>

          {/* STATUS TOGGLE */}
          <div>
            <div className="flex justify-between items-center">
              <label className="w-1/4 text-sm font-medium">Status *</label>

              <div className="w-3/4 flex items-center">
                <button
                  onClick={() => setStatus((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
          ${status ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
            ${status ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>

                <span className="ml-3 text-sm text-gray-600">
                  {status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* ICON */}
          <div>
            <div className="flex justify-between">
              <label className="w-1/4 text-sm font-medium">Icon (1:1) *</label>
              <div className="w-3/4">
                <label
                  className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50 ${
                    errors.icon ? "border-red-500" : ""
                  }`}
                >
                  <Upload size={16} />
                  Upload Icon
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      setIcon(e.target.files?.[0] || null);
                      setErrors((prev) => ({
                        ...prev,
                        icon: undefined,
                      }));
                    }}
                  />
                </label>
                {icon && (
                  <p className="text-sm text-gray-500 mt-1">{icon.name}</p>
                )}
                {errors.icon && (
                  <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center ${
              errors.images ? "border-red-500" : ""
            }`}
          >
            <ImageIcon size={40} className="text-gray-500 mb-3" />
            <p className="text-gray-600">Drag Images or</p>
            <label className="text-blue-600 underline cursor-pointer">
              Browse Images
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleBrowse}
              />
            </label>
          </div>

          {errors.images && (
            <p className="text-red-500 text-sm mt-2">{errors.images}</p>
          )}

          {images.length > 0 && (
            <div className="mt-4 text-sm">
              {images.map((img, i) => (
                <p key={i}>{img.name}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Category"}
        </button>
      </div>
    </div>
  );
}
