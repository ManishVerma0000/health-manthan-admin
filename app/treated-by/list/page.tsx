"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Loader2,
  Building2,
  FolderX,
  Plus,
  Search,
} from "lucide-react";

import {
  getTreatedByListApi,
  deleteTreatedByApi,
} from "@/services/treatedBy.service";

import { useRouter } from "next/navigation";

import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast from "@/components/Toast";

/* ---------------- Types ---------------- */
type TreatedBy = {
  _id: string;
  treatedByName: string;
};

/* ---------------- Component ---------------- */
export default function TreatedByListPage() {
  const router = useRouter();

  /* ---------------- States ---------------- */
  const [list, setList] = useState<TreatedBy[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  /* ===============================
     FETCH LIST
  =============================== */
  const fetchList = async () => {
    try {
      setLoading(true);

      const res = await getTreatedByListApi();

      setList(res?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);

      setToast({
        show: true,
        message: "Failed to load treated by",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /* ===============================
     DELETE
  =============================== */
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      await deleteTreatedByApi(deleteId);

      setList((prev) => prev.filter((i) => i._id !== deleteId));

      setDeleteId(null);

      setToast({
        show: true,
        message: "Deleted successfully",
        type: "success",
      });
      setTimeout(() => {
        router.push("/treated-by/list");
      }, 1000);
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
     FILTER
  =============================== */
  const filteredList = list.filter((item) =>
    item.treatedByName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ===============================
     UI
  =============================== */
  return (
    <div className="min-h-screen p-6 md:p-8">
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
                <Building2 className="text-white" size={20} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">Treated By</h1>
              </div>
            </div>

            <button
              onClick={() => router.push("/treated-by/add")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:scale-105"
            >
              <Plus size={20} />
              New
            </button>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Search treated by..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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

              <p className="text-gray-600 font-medium">Loading treated by...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <FolderX size={48} className="text-gray-400" />
              </div>

              <p className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm ? "No results found" : "No records yet"}
              </p>

              <p className="text-sm text-gray-500 text-center max-w-sm">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first treated by"}
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && filteredList.length > 0 && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredList.map((item, index) => (
                  <div
                    key={item._id}
                    className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-indigo-300 transition-all"
                  >
                    <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      #{index + 1}
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-3 shadow-md">
                        <Building2 className="text-white" size={24} />
                      </div>

                      <div className="flex-1 pt-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate pr-8">
                          {item.treatedByName}
                        </h3>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => setDeleteId(item._id)}
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
        {!loading && filteredList.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Showing {filteredList.length} of {list.length}{" "}
              {list.length === 1 ? "record" : "records"}
            </p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Treated By"
        description="Are you sure you want to delete this record?"
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
