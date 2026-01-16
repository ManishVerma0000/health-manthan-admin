"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { DataTable, Column } from "../../../components/Table";
import { getCategoriesApi } from "@/services/category.services";

interface SurgeryCategory {
  id: string;
  categoryName: string;
  imageUrl: string;
  iconImage: string;
  status: boolean;
}

export default function SurgeryCategoryPage() {
  const [data, setData] = useState<SurgeryCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: Column<SurgeryCategory>[] = [
    { key: "categoryName", label: "Category Name" },

    {
      key: "imageUrl",
      label: "Image",
      render: (val) => (
        <img
          src={val}
          alt="category"
          className="w-10 h-10 rounded-md object-cover border"
        />
      ),
    },

    {
      key: "iconImage",
      label: "Icon",
      render: (val) => (
        <img
          src={val}
          alt="icon"
          className="w-10 h-10 rounded-md object-cover border"
        />
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (val) => (
        <span
          className={`px-3 py-1 text-xs rounded-full font-medium
            ${val ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
        >
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Action",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Pencil className="w-4 h-4 cursor-pointer text-blue-600" />
          <Trash2 className="w-4 h-4 cursor-pointer text-red-500" />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesApi();
        const mapped: SurgeryCategory[] = res.data.map((item: any) => ({
          id: item._id,
          categoryName: item.categoryName,
          imageUrl: item.imageUrl,
          iconImage: item.iconImage,
          status: item.status,
        }));
        setData(mapped);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Surgery Category</h2>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
