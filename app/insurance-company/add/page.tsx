"use client";

import { createInsuranceCompanyApi } from "@/services/insuranceCompany.service";
import { useState } from "react";

export default function AddInsuranceCompanyPage() {
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [loading, setLoading] = useState(false);

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
    alert("Insurance Company created successfully");
    setInsuranceCompany("");
  } catch (error: any) {
    console.error("Create insurance company error:", error);
    alert(error.message || "Error creating Insurance Company");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
  );
}
