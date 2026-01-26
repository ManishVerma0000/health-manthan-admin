"use client";

import Header from "@/components/Header";
import { createHospitalCategoryApi } from "@/services/hospital.service";
import { useState } from "react";

export default function AddHospitalCategoryPage() {
  const [hospitalCategory, setHospitalCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!hospitalCategory.trim()) {
      alert("Hospital Category is required");
      return;
    }
    try {
      setLoading(true);
      const res = await createHospitalCategoryApi(hospitalCategory);
      if (!res?.success) {
        throw new Error(res?.message || "Something went wrong");
      }
      alert("Hospital Category created successfully");
      setHospitalCategory(""); // reset input
    } catch (error: any) {
      alert(error?.message || "Error creating Hospital Category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gray-100">
      <Header />
      <div className="flex items-center justify-center bg-gray-100 mt-20">
         <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Add Hospital Category
        </h2>

        <input
          type="text"
          placeholder="Enter hospital category"
          value={hospitalCategory}
          onChange={(e) => setHospitalCategory(e.target.value)}
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
     
    </div>
  );
}
