"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  deleteHospitalCategoryApi,
  fetchHospitalCategoriesApi,
} from "@/services/hospital.service";

type Category = {
  _id: string;
  hospitalCategory: string;
};

export default function HospitalCategoryListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH LIST
  // ===============================
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchHospitalCategoriesApi();
      if (data?.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ===============================
  // DELETE CATEGORY
  // ===============================
  const deleteCategory = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;
    try {
      const data = await deleteHospitalCategoryApi(id);
      if (data?.success) {
        setCategories((prev) => prev.filter((category) => category._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      alert("Error deleting category");
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Hospital Categories</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories found</p>
        ) : (
          <ul className="space-y-3">
            {categories.map((category) => (
              <li
                key={category._id}
                className="flex items-center justify-between border rounded-md px-4 py-2"
              >
                <span>{category.hospitalCategory}</span>

                <button
                  onClick={() => deleteCategory(category._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
