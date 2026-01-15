"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { DataTable, Column } from "../../../components/Table";
import { getCategoriesApi } from "@/services/category.services";

interface SurgeryCategory {
  id: string;
  created: string;
  categoryName: string;
  image: string;
  icon: string;
  lastUpdated: string;
  status: string;
}

export default function SurgeryCategoryPage() {
  const [data, setData] = useState<SurgeryCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: Column<SurgeryCategory>[] = [
    { key: "categoryName", label: "Category Name" },

    {
      key: "image",
      label: "Image",
      render: (val) =>
        val ? (
          <img src={val} alt="img" width={40} height={40} className="rounded" />
        ) : (
          "—"
        ),
    },

    {
      key: "icon",
      label: "Icon",
      render: (val) =>
        val ? (
          <img
            src={val}
            alt="icon"
            width={40}
            height={40}
            className="rounded"
          />
        ) : (
          "—"
        ),
    },

    {
      key: "actions",
      label: "Action",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Pencil className="w-4 h-4 cursor-pointer text-gray-700" />
          <Trash2 className="w-4 h-4 cursor-pointer text-red-500" />
        </div>
      ),
    },
  ];

  interface SurgeryCategory {
    created: string;
    categoryName: string;
    image: string;
    icon: string;
    lastUpdated: string;
    status: string;
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesApi();
        const mapped: SurgeryCategory[] = res.data.map((item: any) => ({
          categoryName: item.categoryName,
          image: item?.imageUrl,
          icon: item?.iconImage,
          status: "Success",
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
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Surgery Category</h2>
        <button className="px-4 py-2 rounded-md bg-blue-600 text-white">
          New
        </button>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
