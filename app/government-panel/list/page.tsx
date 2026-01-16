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
  getGovernmentPanelListApi,
  deleteGovernmentPanelApi,
} from "@/services/governmentPanel.service";

type Panel = {
  _id: string;
  panelName: string;
};

export default function GovernmentPanelListPage() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ===============================
  // FETCH PANELS
  // ===============================
  const fetchPanels = async () => {
    try {
      setLoading(true);
      const res = await getGovernmentPanelListApi();
      setPanels(res?.data || []);
    } catch (error) {
      console.error("Failed to fetch panels", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanels();
  }, []);

  // ===============================
  // DELETE PANEL
  // ===============================
  const deletePanel = async (id: string) => {
    const confirmDelete = confirm("Delete this panel?");
    if (!confirmDelete) return;

    try {
      const res = await deleteGovernmentPanelApi(id);
      if (res?.success !== false) {
        setPanels((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      alert("Error deleting panel");
    }
  };

  // ===============================
  // FILTER
  // ===============================
  const filteredPanels = panels.filter((panel) =>
    panel.panelName.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Building2 className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Government Panels
                </h1>
                <p className="text-sm text-gray-600">
                  Manage and organize government panel data
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:scale-105">
              <Plus size={20} />
              Add Panel
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
                placeholder="Search government panels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="bg-white rounded-xl px-5 py-2.5 border border-gray-200 shadow-sm">
              <span className="text-sm text-gray-600">Total Panels</span>
              <p className="text-2xl font-bold text-indigo-600">
                {panels.length}
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
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
          {!loading && filteredPanels.length > 0 && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPanels.map((panel, index) => (
                  <div
                    key={panel._id}
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
                          {panel.panelName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Government Panel
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => deletePanel(panel._id)}
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
        {!loading && filteredPanels.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Showing {filteredPanels.length} of {panels.length}{" "}
              {panels.length === 1 ? "panel" : "panels"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
