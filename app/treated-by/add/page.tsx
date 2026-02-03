"use client";

import { createTreatedByApi } from "@/services/treatedBy.service";
import { useState } from "react";
import Toast from "@/components/Toast";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function AddTreatedByPage() {
  const router = useRouter();
  const [treatedByName, setTreatedByName] = useState("");

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  const handleSubmit = async () => {
    if (!treatedByName.trim()) {
      setToast({
        show: true,
        message: "Name is required",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await createTreatedByApi({
        treatedByName,
      });
      if (!res?.success) throw new Error();

      setToast({
        show: true,
        message: "Added successfully",
        type: "success",
      });

      setTreatedByName("");

      setTimeout(() => {
        router.push("/treated-by/list");
      }, 1000);
    } catch (error) {
      console.error(error);

      setToast({
        show: true,
        message: "Create failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen   bg-gray-100">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <Header />

      <div className="flex justify-center align-center">
        <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm mt-10">
          <h2 className="text-lg font-semibold mb-4">Add Treated By</h2>

          <input
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Treated By Name"
            value={treatedByName}
            onChange={(e) => setTreatedByName(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
