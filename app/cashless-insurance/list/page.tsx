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
  getCashlessInsuranceListApi,
  deleteCashlessInsuranceApi,
} from "@/services/cashlessInsurance.service";
import { useRouter } from "next/navigation";

type Item = {
  _id: string;
  cashlessInsuranceCompany: string;
};

export default function CashlessInsuranceListPage() {
  const router = useRouter();

  const [list, setList] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ===============================
  // FETCH LIST
  // ===============================
  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await getCashlessInsuranceListApi();
      setList(res?.data || []);
    } catch (error) {
      console.error("Fetch list error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // ===============================
  // DELETE
  // ===============================
  const deleteItem = async (id: string) => {
    const confirmDelete = confirm("Delete this cashless insurance company?");
    if (!confirmDelete) return;

    try {
      const res = await deleteCashlessInsuranceApi(id);
      if (res?.success !== false) {
        setList((prev) => prev.filter((i) => i._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // ===============================
  // FILTER
  // ===============================
  const filteredList = list.filter((item) =>
    item.cashlessInsuranceCompany
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen  p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                <Building2 className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Cashless Insurance Companies
                </h1>
              </div>
            </div>

            <button
              onClick={() => router.push("/cashless-insurance/add")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:scale-105"
            >
              <Plus size={20} />
              New
            </button>
          </div>

          {/* Search + Stats */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search cashless insurance companies..."
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
              <p className="text-gray-600 font-medium">
                Loading cashless insurance companies...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <FolderX size={48} className="text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm ? "No results found" : "No companies yet"}
              </p>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first cashless insurance company"}
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
                          {item.cashlessInsuranceCompany}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => deleteItem(item._id)}
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
              {list.length === 1 ? "company" : "companies"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
