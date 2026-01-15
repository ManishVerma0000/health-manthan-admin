"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteInsuranceCompanyApi, fetchInsuranceCompaniesApi } from "@/services/insuranceCompany.service";

type InsuranceCompany = {
  _id: string;
  insuranceCompany: string;
};

export default function InsuranceCompanyListPage() {
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH LIST
  // ===============================

const fetchCompanies = async () => {
  try {
    setLoading(true);
    const data = await fetchInsuranceCompaniesApi();
    if (data?.success) {
      setCompanies(data.data);
    }
  } catch (error) {
    console.error("Failed to fetch insurance companies", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCompanies();
  }, []);

  // ===============================
  // DELETE COMPANY
  // ===============================


const deleteCompany = async (id: string) => {
  const confirmDelete = confirm(
    "Are you sure you want to delete this insurance company?"
  );
  if (!confirmDelete) return;
  try {
    const data = await deleteInsuranceCompanyApi(id);
    if (data?.success) {
      setCompanies((prev) =>
        prev.filter((company) => company._id !== id)
      );
    } else {
      alert("Delete failed");
    }
  } catch (error) {
    console.error("Error deleting insurance company", error);
    alert("Error deleting insurance company");
  }
};

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Insurance Companies</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : companies.length === 0 ? (
          <p className="text-center text-gray-500">
            No insurance companies found
          </p>
        ) : (
          <ul className="space-y-3">
            {companies.map((company) => (
              <li
                key={company._id}
                className="flex items-center justify-between border rounded-md px-4 py-2"
              >
                <span>{company.insuranceCompany}</span>

                <button
                  onClick={() => deleteCompany(company._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
