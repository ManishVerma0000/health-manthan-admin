"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  deleteGovernmentPanelApi,
  getGovernmentPanelListApi,
} from "@/services/governmentPanel.service";

type Panel = {
  _id: string;
  panelName: string;
};

export default function GovernmentPanelListPage() {
  const [list, setList] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPanels();
  }, []);

  const fetchPanels = async () => {
    try {
      setLoading(true);
      const res = await getGovernmentPanelListApi();
      setList(res.data || []);
    } catch (error) {
      console.error("Fetch panel list error:", error);
    } finally {
      setLoading(false);
    }
  };
  const deletePanel = async (id: string) => {
    if (!confirm("Delete this panel?")) return;

    try {
      await deleteGovernmentPanelApi(id);
      setList((prev) => prev.filter((p) => p._id !== id));
      alert("Panel deleted successfully");
    } catch (error) {
      console.error("Delete panel error:", error);
      alert("Error deleting panel");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Government Panels</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Panel Name</th>
            <th className="border p-2 w-24">Action</th>
          </tr>
        </thead>
        <tbody>
          {list?.map((panel) => (
            <tr key={panel._id}>
              <td className="border p-2">{panel?.panelName}</td>
              <td className="border p-2 text-center">
                <Trash2
                  className="text-red-600 cursor-pointer mx-auto"
                  size={18}
                  onClick={() => deletePanel(panel._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
