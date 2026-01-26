"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Loader2,
  Scissors,
  Plus,
  Image,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getCategoriesApi,
  deleteCategoryApi,
} from "@/services/category.services";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast from "@/components/Toast";

interface SurgeryCategory {
  id: string;
  categoryName: string;
  imageUrl: string;
  iconImage: string;
  status: boolean;
}

export default function SurgeryCategoryPage() {
  const router = useRouter();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [data, setData] = useState<SurgeryCategory[]>([]);
  const [filteredData, setFilteredData] = useState<SurgeryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 5;

  /* Fetch Categories */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesApi();

        const mapped: SurgeryCategory[] = res.data.map((item: any) => ({
          id: item._id,
          categoryName: item.categoryName,
          imageUrl: item.imageUrl,
          iconImage: item.iconImage,
          status: item.status,
        }));

        setData(mapped);
        setFilteredData(mapped);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* Search Filter */
  useEffect(() => {
    if (!search) {
      setFilteredData(data);
      setPage(1);
      return;
    }

    const q = search.toLowerCase();

    setFilteredData(
      data.filter((item) => item.categoryName.toLowerCase().includes(q)),
    );

    setPage(1);
  }, [search, data]);

  /* Pagination */
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedData = filteredData.slice(start, end);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteCategoryApi(deleteId);
      const updated = data.filter((item) => item.id !== deleteId);
      setData(updated);
      setFilteredData(updated);
      setDeleteId(null);
      setToast({
        show: true,
        message: "Deleted successfully",
        type: "success",
      });
    } catch (err) {
      // console.error("Delete failed:", err);
      setToast({
        show: true,
        message: "Delete  failed",
        type: "error",
      });
    }
  };
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      {/* Global Header */}
      <Header
        searchValue={search}
        onSearchChange={(value) => setSearch(value)}
      />

      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <Scissors className="text-white" size={18} />
              </div>

              <h1 className="text-xl font-bold text-gray-900">
                Surgery Categories
              </h1>
            </div>

            <button
              onClick={() => router.push("/category/add")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium"
            >
              <Plus size={16} />
              New
            </button>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden ">
            {/* Loading */}
            {loading ? (
              <div className="flex flex-col items-center py-20">
                <Loader2
                  className="animate-spin text-indigo-600 mb-4"
                  size={40}
                />
                <p className="text-gray-600">Loading categories...</p>
              </div>
            ) : paginatedData.length === 0 ? (
              /* Empty */
              <div className="flex flex-col items-center py-20">
                <Scissors size={48} className="text-gray-400 mb-3" />

                <p className="text-lg font-semibold">
                  {search ? "No results found" : "No categories yet"}
                </p>
              </div>
            ) : (
              /* Table */
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Category Name
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Image
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Icon
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {paginatedData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-indigo-50">
                        {/* Name */}
                        <td className="px-6 py-4">
                          <p className="font-semibold">{item.categoryName}</p>

                          <p className="text-xs text-gray-500">
                            Category #{start + index + 1}
                          </p>
                        </td>

                        {/* Image */}
                        <td className="px-6 py-4">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <Image className="text-gray-400" />
                          )}
                        </td>

                        {/* Icon */}
                        <td className="px-6 py-4">
                          {item.iconImage ? (
                            <img
                              src={item.iconImage}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <Image className="text-gray-400" />
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              item.status
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.status ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {/* <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                              <Pencil size={18} />
                            </button> */}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(item.id); // Open modal
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && filteredData.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page <span className="font-semibold">{page}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold">
                  {page}
                </span>

                <button
                  disabled={end >= filteredData.length}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Category"
        description="Are you sure you want to delete this category? This will remove all related data."
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
