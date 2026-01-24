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
import { getSurgeryListApi } from "@/services/surgery.service";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface SurgeryItem {
  id: string;
  surgeryName: string;
  surgeryCategory: string;
  icon: string;
  image: string;
  status: boolean;
}

export default function SurgeryCategoryPage() {
  const [data, setData] = useState<SurgeryItem[]>([]);
  const [filteredData, setFilteredData] = useState<SurgeryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const router = useRouter();

  useEffect(() => {
    const fetchSurgeries = async () => {
      try {
        const res = await getSurgeryListApi();

        const mapped: SurgeryItem[] = res.data.map((item: any) => ({
          id: item._id,
          surgeryName: item.surgeryName,
          surgeryCategory: item.surgeryCategory,
          icon: item.icon,
          image: item.images?.[0] || "",
          status: true,
        }));

        setData(mapped);
        setFilteredData(mapped);
      } catch (error) {
        console.error("Error fetching surgeries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurgeries();
  }, []);

  /* 🔍 Header Search Filter */
  useEffect(() => {
    if (!search) {
      setFilteredData(data);
      setPage(1);
      return;
    }

    const q = search.toLowerCase();
    setPage(1);

    setFilteredData(
      data.filter(
        (item) =>
          item.surgeryName.toLowerCase().includes(q) ||
          item.surgeryCategory.toLowerCase().includes(q),
      ),
    );
  }, [search, data]);

  /* 📄 Pagination Slice */
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = filteredData.slice(start, end);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* 🔹 GLOBAL HEADER SEARCH */}
      <Header
        searchValue={search}
        onSearchChange={(value) => setSearch(value)}
      />

      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <Scissors className="text-white" size={18} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Surgery List</h1>
            </div>

            <button
              onClick={() => router.push("/surgery/add")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium"
            >
              <Plus size={16} />
              New
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center py-20">
                <Loader2
                  className="animate-spin text-indigo-600 mb-4"
                  size={40}
                />
                <p className="text-gray-600">Loading surgeries...</p>
              </div>
            ) : paginatedData.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <Scissors size={48} className="text-gray-400 mb-3" />
                <p className="text-lg font-semibold">
                  {search ? "No results found" : "No surgeries yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
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

                  <tbody className="divide-y">
                    {paginatedData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-indigo-50">
                        <td className="px-6 py-4">
                          <p className="font-semibold">{item.surgeryName}</p>
                          <p className="text-xs text-gray-500">
                            Surgery #{start + index + 1}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {item.surgeryCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <Image className="text-gray-400" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {item.icon ? (
                            <img
                              src={item.icon}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <Image className="text-gray-400" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                              <Pencil size={18} />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded">
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
    </div>
  );
}
