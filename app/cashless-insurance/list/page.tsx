"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  deleteCashlessInsuranceApi,
  getCashlessInsuranceListApi,
} from "@/services/cashlessInsurance.service";

type Item = {
  _id: string;
  cashlessInsuranceCompany: string;
};

export default function CashlessInsuranceListPage() {
  const [list, setList] = useState<Item[]>([]);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await getCashlessInsuranceListApi();
        setList(res.data || []);
      } catch (error) {
        console.error("Fetch list error:", error);
      }
    };

    fetchList();
  }, []);

  const deleteItem = async (id: string) => {
    if (!confirm("Delete?")) return;

    try {
      await deleteCashlessInsuranceApi(id);
      setList((prev) => prev.filter((i) => i._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">
        Cashless Insurance Companies
      </h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2 w-24">Action</th>
          </tr>
        </thead>
        <tbody>
          {list?.map((item) => (
            <tr key={item._id}>
              <td className="border p-2">{item.cashlessInsuranceCompany}</td>
              <td className="border p-2 text-center">
                <Trash2
                  className="text-red-600 cursor-pointer mx-auto"
                  size={18}
                  onClick={() => deleteItem(item._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
