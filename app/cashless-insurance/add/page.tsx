"use client";

import { createCashlessInsuranceApi } from "@/services/cashlessInsurance.service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Toast from "@/components/Toast";

export default function AddCashlessInsurancePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Cashless Insurance Company name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await createCashlessInsuranceApi({
        cashlessInsuranceCompany: name.trim(),
      });
      if (!res?.success) {
        throw new Error(res?.message || "Failed");
      }
      setToast({
        show: true,
        message: "Cashless Insurance added successfully",
        type: "success",
      });
      setTimeout(() => {
        router.push("/cashless-insurance/list");
      }, 1000);
      setName("");
    } catch (error) {
      console.error("Cashless Insurance error:", error);
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
          <h2 className="text-lg font-semibold mb-4">Add Cashless Insurance</h2>

          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Cashless Insurance Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
