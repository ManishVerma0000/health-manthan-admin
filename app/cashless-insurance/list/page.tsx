"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Loader2,
  Building2,
  FolderX,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getCashlessInsuranceListApi,
  deleteCashlessInsuranceApi,
} from "@/services/cashlessInsurance.service";

import { useRouter } from "next/navigation";

import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast from "@/components/Toast";
import Header from "@/components/Header";

/* ---------------- Types ---------------- */
type Item = {
  _id: string;
  cashlessInsuranceCompany: string;
};

/* ---------------- Component ---------------- */
export default function CashlessInsuranceListPage() {
  const router = useRouter();

  /* ---------------- States ---------------- */
  const [list, setList] = useState<Item[]>([]);
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
     FETCH LIST
  =============================== */
  const fetchList = async () => {
    try {
      setLoading(true);

      const res = await getCashlessInsuranceListApi();

      setList(res?.data || []);
    } catch (error) {
      console.error("Fetch list error:", error);

      setToast({
        show: true,
        message: "Failed to load companies",
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
     RESET PAGE ON SEARCH
  =============================== */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  /* ===============================
     FIX PAGE AFTER DELETE / FILTER
  =============================== */
  useEffect(() => {
    const totalPages = Math.ceil(
      filteredList.length / itemsPerPage,
    );

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, list, searchTerm]);

  /* ===============================
     DELETE
  =============================== */
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      await deleteCashlessInsuranceApi(deleteId);

      setList((prev) =>
        prev.filter((i) => i._id !== deleteId),
      );

      setDeleteId(null);

      setToast({
        show: true,
        message: "Company deleted successfully",
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
  const filteredList = list.filter((item) =>
    item?.cashlessInsuranceCompany
      ?.toLowerCase()
      ?.includes(searchTerm.toLowerCase()),
  );

  /* ===============================
     PAGINATION
  =============================== */
  const totalPages = Math.ceil(
    filteredList.length / itemsPerPage,
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedList = filteredList.slice(
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
        onClose={() =>
          setToast({ ...toast, show: false })
        }
      />

      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">

          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">

              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                <Building2
                  className="text-white"
                  size={20}
                />
              </div>

              <h1 className="text-xl font-bold text-gray-900">
                Cashless Insurance Companies
              </h1>

            </div>

            <button
              onClick={() =>
                router.push("/cashless-insurance/add")
              }
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200"
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
                Loading companies...
              </p>

            </div>
          )}

          {/* Empty */}
          {!loading && paginatedList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4">

              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <FolderX
                  size={48}
                  className="text-gray-400"
                />
              </div>

              <p className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm
                  ? "No results found"
                  : "No companies yet"}
              </p>

            </div>
          )}

          {/* Grid */}
          {!loading && paginatedList.length > 0 && (
            <div className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {paginatedList.map(
                  (item, index) => (
                    <div
                      key={item._id}
                      className="group relative border rounded-xl p-5 hover:shadow-lg transition-all"
                    >

                      <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                        #{startIndex + index + 1}
                      </div>

                      <div className="flex items-start gap-4">

                        <div className="bg-indigo-600 rounded-lg p-3">
                          <Building2
                            className="text-white"
                            size={24}
                          />
                        </div>

                        <h3 className="font-semibold text-lg truncate">
                          {item.cashlessInsuranceCompany}
                        </h3>

                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-4 border-t flex justify-end opacity-0 group-hover:opacity-100 transition">

                        <button
                          onClick={() =>
                            setDeleteId(item._id)
                          }
                          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>

                      </div>

                    </div>
                  ),
                )}

              </div>

            </div>
          )}

        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col items-center gap-3">

            {/* Info */}
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1}–
              {Math.min(
                startIndex + itemsPerPage,
                filteredList.length,
              )}{" "}
              of {filteredList.length}
            </p>

            <div className="flex justify-center items-center gap-3">

              {/* Prev */}
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p) => p - 1)
                }
                className="p-2 rounded border disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Pages */}
              {Array.from(
                { length: totalPages },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`px-3 py-1 rounded border text-sm
                    ${
                      currentPage === page
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              ))}

              {/* Next */}
              <button
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((p) => p + 1)
                }
                className="p-2 rounded border disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronRight size={18} />
              </button>

            </div>

          </div>
        )}

      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Company"
        description="Are you sure?"
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
