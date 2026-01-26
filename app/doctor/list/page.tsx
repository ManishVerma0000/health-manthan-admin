"use client";

import { useEffect, useState } from "react";

import {
  Loader2,
  Plus,
  Image,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Trash2,
} from "lucide-react";

import { getDoctorList, deleteDoctorApi } from "@/services/doctor.service";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";

import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast from "@/components/Toast";

/* ------------------ Types ------------------ */
interface DoctorItem {
  _id: string;
  imageUrl: string[];
  contactNumber: string;
  whatsAppNumber: string;
  qualificationAndExperience: string;
  createdAt: string;

  hospital: {
    hospitalName: string;
    city: string;
  };

  timings: {
    _id: string;
    day: string;
    time: string;
  }[];
}

/* ------------------ Component ------------------ */
export default function DoctorListPage() {
  const router = useRouter();

  /* ------------------ States ------------------ */
  const [data, setData] = useState<DoctorItem[]>([]);
  const [filteredData, setFilteredData] = useState<DoctorItem[]>([]);
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

  /* ------------------ Fetch Doctors ------------------ */
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await getDoctorList();

      if (res.success) {
        setData(res.data);
        setFilteredData(res.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);

      setToast({
        show: true,
        message: "Failed to load doctors",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Search ------------------ */
  useEffect(() => {
    if (!search.trim()) {
      setFilteredData(data);
      setPage(1);
      return;
    }

    const q = search.toLowerCase();

    setFilteredData(
      data.filter((item) =>
        `${item.hospital?.hospitalName} ${item.hospital?.city}`
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

      await deleteDoctorApi(deleteId);

      const updated = data.filter((item) => item._id !== deleteId);

      setData(updated);
      setFilteredData(updated);

      setDeleteId(null);

      setToast({
        show: true,
        message: "Doctor deleted successfully",
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
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Header */}
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
                <Stethoscope className="text-white" size={18} />
              </div>

              <h1 className="text-xl font-bold text-gray-900">Doctor List</h1>
            </div>

            <button
              onClick={() => router.push("/doctor/add")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium"
            >
              <Plus size={16} />
              New
            </button>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center py-20">
                <Loader2
                  className="animate-spin text-indigo-600 mb-4"
                  size={40}
                />
                <p className="text-gray-600">Loading doctors...</p>
              </div>
            )}

            {/* Empty */}
            {!loading && paginatedData.length === 0 && (
              <div className="flex flex-col items-center py-20">
                <Stethoscope size={48} className="text-gray-400 mb-3" />

                <p className="text-lg font-semibold">
                  {search ? "No results found" : "No doctors yet"}
                </p>
              </div>
            )}

            {/* Table */}
            {!loading && paginatedData.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  {/* Head */}
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        SN
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        ID
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Image
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Hospital
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Location
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Created
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody className="divide-y">
                    {paginatedData.map((doctor, index) => (
                      <tr
                        key={doctor._id}
                        onClick={() => router.push(`/doctor/${doctor._id}`)}
                        className="hover:bg-indigo-50 cursor-pointer transition"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold">{index + 1}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-semibold">{doctor?._id}</p>
                        </td>

                        {/* Image */}
                        <td className="px-6 py-4">
                          {doctor.imageUrl?.length ? (
                            <img
                              src={doctor.imageUrl[0]}
                              alt="doctor"
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <Image className="text-gray-400" />
                          )}
                        </td>

                        {/* Hospital */}
                        <td className="px-6 py-4">
                          <p className="font-medium">
                            {doctor.hospital?.hospitalName}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-medium">{doctor.hospital?.city}</p>
                        </td>

                        {/* Created */}
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(doctor.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(doctor._id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={18} />
                          </button>
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

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Doctor"
        description="Are you sure you want to delete this doctor? This action cannot be undone."
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
