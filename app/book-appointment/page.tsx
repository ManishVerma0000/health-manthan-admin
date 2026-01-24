"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Calendar,
  Phone,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
} from "lucide-react";
import { getBookAppointmentListApi } from "@/services/bookAppointment.service";
import Header from "@/components/Header";

interface Appointment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  createdAt: string;
}

export default function BookAppointmentList() {
  const [data, setData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getBookAppointmentListApi({
        page,
        limit,
        search,
      });

      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page, search]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* 🔹 Global Header Search */}
      <Header
        searchValue={search}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
      />

      {/* 🔹 Page Content */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto px-6 py-6 overflow-hidden w-full">
        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <CalendarCheck className="text-white" size={18} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Appointment Bookings
            </h1>
          </div>

        </div>

        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl  -gray-100 overflow-hidden">
          <div className="h-full overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="-b bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Appointment Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Created At
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2
                        className="animate-spin text-indigo-600 mx-auto mb-3"
                        size={36}
                      />
                      <p className="text-gray-600">Loading appointments...</p>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <CalendarCheck
                        size={40}
                        className="mx-auto text-gray-400 mb-3"
                      />
                      <p className="text-lg font-semibold text-gray-800">
                        {search ? "No results found" : "No appointments yet"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {search
                          ? "Try adjusting your search terms"
                          : "Appointment bookings will appear here"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-indigo-50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Booking #{index + 1 + (page - 1) * limit}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {item.phone}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {new Date(item.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination (Always Bottom) */}
        {!loading && data.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page <span className="font-semibold">{page}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-white  rounded-lg disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold">
                {page}
              </span>

              <button
                disabled={data.length < limit}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-white  rounded-lg disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
