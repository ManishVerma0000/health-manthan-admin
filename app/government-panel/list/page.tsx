"use client";

import { useEffect, useState } from "react";

import { Trash2, Loader2, Building2, FolderX, Plus } from "lucide-react";

import {
  getGovernmentPanelListApi,
  deleteGovernmentPanelApi,
} from "@/services/governmentPanel.service";

import { useRouter } from "next/navigation";

import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast from "@/components/Toast";
import Header from "@/components/Header";

/* ---------------- Types ---------------- */
type Panel = {
  _id: string;
  panelName: string;
};

/* ---------------- Component ---------------- */
export default function GovernmentPanelListPage() {
  const router = useRouter();

  /* ---------------- States ---------------- */
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  /* ===============================
     FETCH PANELS
  =============================== */
  const fetchPanels = async () => {
    try {
      setLoading(true);

      const res = await getGovernmentPanelListApi();

      setPanels(res?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);

      setToast({
        show: true,
        message: "Failed to load panels",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanels();
  }, []);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  /* ===============================
     DELETE HANDLER
  =============================== */
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await deleteGovernmentPanelApi(deleteId);
      setPanels((prev) => prev.filter((p) => p._id !== deleteId));
      setDeleteId(null);
      setToast({
        show: true,
        message: "Panel deleted successfully",
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
     FILTER
  =============================== */
  const filteredPanels = panels.filter((panel) =>
    panel.panelName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ===============================
     PAGINATION
  =============================== */
  const totalPages = Math.ceil(filteredPanels.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedPanels = filteredPanels.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  /* ===============================
     UI
  =============================== */
  return (
    <div className="min-h-screen">
      {/* Header */}
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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                <Building2 className="text-white" size={20} />
              </div>

              <h1 className="text-xl font-bold text-gray-900">
                Government Panels
              </h1>
            </div>

            <button
              onClick={() => router.push("/government-panel/add")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg transition-all"
            >
              <Plus size={20} />
              New
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2
                className="animate-spin text-indigo-600 mb-4"
                size={40}
              />

              <p className="text-gray-600 font-medium">
                Loading government panels...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredPanels.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <FolderX size={48} className="text-gray-400" />
              </div>

              <p className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm ? "No results found" : "No panels yet"}
              </p>

              <p className="text-sm text-gray-500 text-center max-w-sm">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first government panel"}
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && paginatedPanels.length > 0 && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedPanels.map((panel, index) => (
                  <div
                    key={panel._id}
                    className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all"
                  >
                    <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      #{startIndex + index + 1}
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-600 rounded-lg p-3 shadow-md">
                        <Building2 className="text-white" size={24} />
                      </div>

                      <div className="flex-1 pt-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate pr-8">
                          {panel.panelName}
                        </h3>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => setDeleteId(panel._id)}
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

        {/* Footer + Pagination */}
        {!loading && filteredPanels.length > 0 && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing {paginatedPanels.length} of {filteredPanels.length} panels
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                {/* Prev */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-100"
                >
                  Prev
                </button>

                {/* Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm border
                    ${
                      page === currentPage
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "hover:bg-gray-100"
                    }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                {/* Next */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Government Panel"
        description="Are you sure you want to delete this government panel? This action cannot be undone."
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
