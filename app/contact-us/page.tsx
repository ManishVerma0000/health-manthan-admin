"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { getContactListApi } from "@/services/contact.service";
import Header from "@/components/Header";

interface Contact {
  _id: string;
  name: string;
  mobileNumber: string;
  city: string;
  createdAt: string;
}

export default function ContactUsList() {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getContactListApi({
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
      {/* Header */}
      <Header
        searchValue={search}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
      />

      <div className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full flex flex-col">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg">
            <Mail className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            Contact Inquiries
          </h1>
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col flex-1 bg-white rounded-2xl shadow-xl   overflow-hidden">
          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Mobile
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    City
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Created At
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center">
                      <Loader2
                        className="animate-spin text-indigo-600 mx-auto mb-3"
                        size={36}
                      />
                      <p className="text-gray-600 font-medium">
                        Loading contacts...
                      </p>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center">
                      <Mail size={40} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-lg font-semibold text-gray-800">
                        {search ? "No results found" : "No contacts yet"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {search
                          ? "Try adjusting your search terms"
                          : "Contact inquiries will appear here"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item._id} className="hover:bg-indigo-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Contact #{index + 1 + (page - 1) * limit}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {item.mobileNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {item.city}
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

          {/* Pagination – FIXED AT BOTTOM */}
          {!loading && data.length > 0 && (
            <div className="mt-auto px-6 py-4  bg-white flex items-center justify-between">
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
    </div>
  );
}
