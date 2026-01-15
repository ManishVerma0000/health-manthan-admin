"use client";

import { getHospitalList } from "@/services/hospital.service";
import { useEffect, useMemo, useState } from "react";

interface Hospital {
  _id: string;
  hospitalName: string;
  hospitalType: string;
  contactNumber: string;
  whatsapp: string;
  email: string;
  city: string;
  location: string;
  imageUrls: string[];
}

const ITEMS_PER_PAGE = 5;

export default function HospitalListPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await getHospitalList();
        setHospitals(res?.data || []);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) =>
      `${h.hospitalName} ${h.city}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [hospitals, search]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredHospitals.length / ITEMS_PER_PAGE);
  const paginatedHospitals = filteredHospitals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading hospitals...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold">Hospital List</h1>

        <input
          type="text"
          placeholder="Search by name or city..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="mt-3 sm:mt-0 w-full sm:w-72 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Hospital</th>
              <th className="px-4 py-3 text-left">City</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">WhatsApp</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Location</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {paginatedHospitals.map((hospital) => (
              <tr key={hospital._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {hospital.imageUrls?.length ? (
                    <img
                      src={hospital.imageUrls[0]}
                      alt={hospital.hospitalName}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </td>

                <td className="px-4 py-3 font-medium">
                  {hospital.hospitalName}
                </td>

                <td className="px-4 py-3">{hospital.city}</td>

                <td className="px-4 py-3">{hospital.contactNumber}</td>

                <td className="px-4 py-3">{hospital.whatsapp}</td>

                <td className="px-4 py-3 truncate max-w-[180px]">
                  {hospital.email}
                </td>

                <td className="px-4 py-3 truncate max-w-[200px]">
                  {hospital.location}
                </td>
              </tr>
            ))}

            {paginatedHospitals.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No hospitals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
