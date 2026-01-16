"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Loader2,
  Scissors,
  Plus,
  Image,
  Folder,
} from "lucide-react";
import { getSurgeryListApi } from "@/services/surgery.service";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error("Error fetching surgeries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurgeries();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                <Scissors className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Surgery List
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Manage and organize surgery procedures
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                router.push('/surgery/add')
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:scale-105"
            >
              <Plus size={20} />
              Add Surgery
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-3">
            <div className="bg-white rounded-xl px-5 py-2.5 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Scissors size={20} className="text-indigo-600" />
                <div>
                  <span className="text-xs text-gray-600 block">
                    Total Surgeries
                  </span>
                  <p className="text-xl font-bold text-indigo-600">
                    {data.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl px-5 py-2.5 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Folder size={20} className="text-blue-600" />
                <div>
                  <span className="text-xs text-gray-600 block">
                    Categories
                  </span>
                  <p className="text-xl font-bold text-blue-600">
                    {new Set(data.map((item) => item.surgeryCategory)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2
                className="animate-spin text-indigo-600 mb-4"
                size={40}
              />
              <p className="text-gray-600 font-medium">Loading surgeries...</p>
            </div>
          ) : data.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <Scissors size={48} className="text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-2">
                No surgeries yet
              </p>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                Get started by adding your first surgery procedure
              </p>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Scissors size={16} />
                        Surgery Name
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Folder size={16} />
                        Category
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Image size={16} />
                        Image
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Image size={16} />
                        Icon
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-indigo-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 rounded-lg p-2">
                            <Scissors size={18} className="text-indigo-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {item.surgeryName}
                            </div>
                            <div className="text-xs text-gray-500">
                              Surgery #{index + 1}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.surgeryCategory}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt="surgery"
                            className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                            <Image size={20} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.icon ? (
                          <img
                            src={item.icon}
                            alt="icon"
                            className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                            <Image size={20} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
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

        {/* Footer Info */}
        {!loading && data.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Showing {data.length}{" "}
              {data.length === 1 ? "surgery" : "surgeries"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
