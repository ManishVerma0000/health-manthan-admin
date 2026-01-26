"use client";

import { createGovernmentPanelApi } from "@/services/governmentPanel.service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import Header from "@/components/Header";

export default function AddGovernmentPanelPage() {
  const router = useRouter();
  const [panelName, setPanelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  const handleSubmit = async () => {
    if (!panelName.trim()) {
      alert("Panel name is required");
      return;
    }
    try {
      setLoading(true);
      const res = await createGovernmentPanelApi({ panelName });
      if (!res.success) throw new Error();
      setPanelName("");
      setToast({
        show: true,
        message: "Panel added successfully",
        type: "success",
      });
      setTimeout(() => {
        router.push("/government-panel/list");
      }, 1000);
    } catch (error) {
      console.error("Create panel error:", error);
      setToast({
        show: true,
        message: "Error adding panel",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <Header />
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
    </>
  );
}
