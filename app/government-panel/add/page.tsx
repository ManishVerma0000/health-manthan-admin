"use client";

import { createGovernmentPanelApi } from "@/services/governmentPanel.service";
import { useState } from "react";

export default function AddGovernmentPanelPage() {
  const [panelName, setPanelName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!panelName.trim()) {
      alert("Panel name is required");
      return;
    }
    try {
      setLoading(true);
      const res = await createGovernmentPanelApi({ panelName });
      if (!res.success) throw new Error();
      alert("Panel added successfully");
      setPanelName("");
    } catch (error) {
      console.error("Create panel error:", error);
      alert("Error adding panel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Add Government Panel</h2>

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Panel Name"
          value={panelName}
          onChange={(e) => setPanelName(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
