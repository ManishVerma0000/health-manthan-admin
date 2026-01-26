"use client";

import { useEffect, useState } from "react";

import {
  Trash2,
  Loader2,
  Building2,
  FolderX,
  Plus,
} from "lucide-react";

import {
  fetchHospitalCategoriesApi,
  deleteHospitalCategoryApi,
} from "@/services/hospital.service";

import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

/* ---------------- Types ---------------- */
type Category = {
  _id: string;
  hospitalCategory: string;
};

/* ---------------- Component ---------------- */
export default function HospitalCategoryListPage() {
  const router = useRouter();

  /* ---------------- States ---------------- */
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Search from Header
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  /* ===============================
     FETCH CATEGORIES
  =============================== */
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await fetchHospitalCategoriesApi();

      if (res?.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);

      setToast({
        show: true,
        message: "Failed to load categories",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ===============================
     DELETE HANDLER
  =============================== */
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      await deleteHospitalCategoryApi(deleteId);

      setCategories((prev) =>
        prev.filter((cat) => cat._id !== deleteId),
      );

      setDeleteId(null);

      setToast({
        show: true,
        message: "Category deleted successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Delete error:", error);

      setToast({
        show: true,
        message: "Delete failed",
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  /* ===============================
     FILTER (FROM HEADER SEARCH)
  =============================== */
  const filteredCategories = categories.filter((cat) =>
    cat.hospitalCategory
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  /* ===============================
     UI
  =============================== */
  return (
    <div className="min-h-screen p-6 md:p-8">

      {/* ✅ Header with Search */}
      <Header
        searchValue={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
      />

      {/* Toast */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">

              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                <Building2 className="text-white" size={28} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Hospital Categories
                </h1>
              </div>

            </div>

            <button
              onClick={() => router.push("/hospital-category/add")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:scale-105"
            >
              <Plus size={20} />
              New
            </button>

          </div>

        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">

              <Loader2
                className="animate-spin text-indigo-600 mb-4"
                size={40}
              />

              <p className="text-gray-600 font-medium">
                Loading categories...
              </p>

            </div>
          )}

          {/* Empty */}
          {!loading && filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4">

              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <FolderX size={48} className="text-gray-400" />
              </div>

              <p className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm
                  ? "No results found"
                  : "No categories yet"}
              </p>

              <p className="text-sm text-gray-500 text-center max-w-sm">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first hospital category"}
              </p>

            </div>
          )}

          {/* Grid */}
          {!loading && filteredCategories.length > 0 && (
            <div className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {filteredCategories.map((category, index) => (
                  <div
                    key={category._id}
                    className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-indigo-300 transition-all"
                  >

                    <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      #{index + 1}
                    </div>

                    <div className="flex items-start gap-4">

                      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-3 shadow-md">
                        <Building2
                          className="text-white"
                          size={24}
                        />
                      </div>

                      <div className="flex-1 pt-1">

                        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate pr-8">
                          {category.hospitalCategory}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Hospital Category
                        </p>

                      </div>

                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end opacity-0 group-hover:opacity-100 transition">

                      <button
                        onClick={() => setDeleteId(category._id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && filteredCategories.length > 0 && (
          <div className="mt-6 text-center">

            <p className="text-sm text-gray-500">
              Showing {filteredCategories.length} of{" "}
              {categories.length}{" "}
              {categories.length === 1
                ? "category"
                : "categories"}
            </p>

          </div>
        )}

      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Category"
        description="Are you sure you want to delete this hospital category? This action cannot be undone."
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
