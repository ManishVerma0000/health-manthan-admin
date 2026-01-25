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
  getSurgeryListApi,
  deleteSurgeryApi,
} from "@/services/surgery.service";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";

import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast from "@/components/Toast";

/* ------------------ Types ------------------ */
interface SurgeryItem {
  id: string;
  surgeryName: string;
  surgeryCategory: string;
  icon: string;
  image: string;
  status: boolean;
}

/* ------------------ Component ------------------ */
export default function SurgeryPage() {
  const router = useRouter();

  /* ------------------ States ------------------ */
  const [data, setData] = useState<SurgeryItem[]>([]);
  const [filteredData, setFilteredData] = useState<SurgeryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  const limit = 5;

  /* ------------------ Fetch Surgeries ------------------ */
  useEffect(() => {
    const fetchSurgeries = async () => {
      try {
        setLoading(true);

        const res = await getSurgeryListApi();

        const mapped: SurgeryItem[] = res.data.map(
          (item: any) => ({
            id: item._id,
            surgeryName: item.surgeryName,
            surgeryCategory: item.surgeryCategory,
            icon: item.icon,
            image: item.images?.[0] || "",
            status: true,
          }),
        );

        setData(mapped);
        setFilteredData(mapped);
      } catch (err) {
        console.error("Fetch error:", err);

        setToast({
          show: true,
          message: "Failed to load surgeries",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSurgeries();
  }, []);

  /* ------------------ Search ------------------ */
  useEffect(() => {
    if (!search.trim()) {
      setFilteredData(data);
      setPage(1);
      return;
    }

    const q = search.toLowerCase();

    setFilteredData(
      data.filter(
        (item) =>
          item.surgeryName
            .toLowerCase()
            .includes(q) ||
          item.surgeryCategory
            .toLowerCase()
            .includes(q),
      ),
    );

    setPage(1);
  }, [search, data]);

  /* ------------------ Pagination ------------------ */
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedData = filteredData.slice(start, end);

  /* ------------------ Delete Handler ------------------ */
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      await deleteSurgeryApi(deleteId);

      const updated = data.filter(
        (item) => item.id !== deleteId,
      );

      setData(updated);
      setFilteredData(updated);

      setDeleteId(null);

      setToast({
        show: true,
        message: "Surgery deleted successfully",
        type: "success",
      });
    } catch (err) {
      console.error("Delete error:", err);

      setToast({
        show: true,
        message: "Delete failed",
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  /* ------------------ Render ------------------ */
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      {/* Toast */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({ ...toast, show: false })
        }
      />

      {/* Header */}
      <Header
        searchValue={search}
        onSearchChange={(value) =>
          setSearch(value)
        }
      />

      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <Scissors
                  className="text-white"
                  size={18}
                />
              </div>

              <h1 className="text-xl font-bold text-gray-900">
                Surgery List
              </h1>
            </div>

            <button
              onClick={() =>
                router.push("/surgery/add")
              }
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium"
            >
              <Plus size={16} />
              New
            </button>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[65vh] flex flex-col">

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center py-20">
                <Loader2
                  className="animate-spin text-indigo-600 mb-4"
                  size={40}
                />
                <p className="text-gray-600">
                  Loading surgeries...
                </p>
              </div>
            )}

            {/* Empty */}
            {!loading &&
              paginatedData.length === 0 && (
                <div className="flex flex-col items-center py-20">
                  <Scissors
                    size={48}
                    className="text-gray-400 mb-3"
                  />

                  <p className="text-lg font-semibold">
                    {search
                      ? "No results found"
                      : "No surgeries yet"}
                  </p>
                </div>
              )}

            {/* Table */}
            {!loading &&
              paginatedData.length > 0 && (
                <div className="h-full overflow-x-auto">

                  <table className="min-w-full">

                    {/* Head */}
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                          Surgery Name
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                          Category
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                          Image
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                          Icon
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y">

                      {paginatedData.map(
                        (item, index) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/surgery/${item.id}`,
                              )
                            }
                            className="hover:bg-indigo-50 cursor-pointer transition"
                          >
                            {/* Name */}
                            <td className="px-6 py-4">
                              <p className="font-semibold text-indigo-600">
                                {item.surgeryName}
                              </p>

                              <p className="text-xs text-gray-500">
                                Surgery #
                                {start + index + 1}
                              </p>
                            </td>

                            {/* Category */}
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {
                                  item.surgeryCategory
                                }
                              </span>
                            </td>

                            {/* Image */}
                            <td className="px-6 py-4">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt="surgery"
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              ) : (
                                <Image className="text-gray-400" />
                              )}
                            </td>

                            {/* Icon */}
                            <td className="px-6 py-4">
                              {item.icon ? (
                                <img
                                  src={item.icon}
                                  alt="icon"
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              ) : (
                                <Image className="text-gray-400" />
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex gap-2">

                                {/* Edit */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(
                                      `/surgery/${item.id}/edit`,
                                    );
                                  }}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Pencil
                                    size={18}
                                  />
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(
                                      item.id,
                                    );
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2
                                    size={18}
                                  />
                                </button>

                              </div>
                            </td>
                          </tr>
                        ),
                      )}

                    </tbody>
                  </table>

                </div>
              )}
          </div>

          {/* Pagination */}
          {!loading &&
            filteredData.length > 0 && (
              <div className="mt-6 flex items-center justify-between">

                <p className="text-sm text-gray-600">
                  Page{" "}
                  <span className="font-semibold">
                    {page}
                  </span>
                </p>

                <div className="flex items-center gap-2">

                  <button
                    disabled={page === 1}
                    onClick={() =>
                      setPage(page - 1)
                    }
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    <ChevronLeft
                      size={18}
                    />
                  </button>

                  <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold">
                    {page}
                  </span>

                  <button
                    disabled={
                      end >=
                      filteredData.length
                    }
                    onClick={() =>
                      setPage(page + 1)
                    }
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    <ChevronRight
                      size={18}
                    />
                  </button>

                </div>
              </div>
            )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Surgery"
        description="Are you sure you want to delete this surgery? This action cannot be undone."
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
