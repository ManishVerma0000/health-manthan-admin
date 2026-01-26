"use client";

import { createInsuranceCompanyApi } from "@/services/insuranceCompany.service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import Header from "@/components/Header";

export default function AddInsuranceCompanyPage() {
  const router = useRouter();
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  const handleSubmit = async () => {
    if (!insuranceCompany.trim()) {
      alert("Insurance Company is required");
      return;
    }
    try {
      setLoading(true);
      const data = await createInsuranceCompanyApi(insuranceCompany);
      if (!data?.success) {
        throw new Error(data?.message || "Something went wrong");
      }
      setToast({
        show: true,
        message: "Insurance Company created successfully",
        type: "success",
      });
      setInsuranceCompany("");
      setTimeout(() => {
        router.push("/insurance-company/list");
      }, 1000);
    } catch (error: any) {
      console.error("Create insurance company error:", error);
      setToast({
        show: true,
        message: "Create insurance company error:",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Add Insurance Company
          </h2>

          <input
            type="text"
            placeholder="Enter insurance company name"
            value={insuranceCompany}
            onChange={(e) => setInsuranceCompany(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
}
