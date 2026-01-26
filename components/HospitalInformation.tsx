"use client";

import { useEffect, useState, DragEvent, ChangeEvent } from "react";
import { ChevronDown, ImageIcon } from "lucide-react";
import { HospitalFormData } from "@/type/hospital";
import { fetchInsuranceCompaniesApi } from "@/services/insuranceCompany.service";
import { getCashlessInsuranceListApi } from "@/services/cashlessInsurance.service";
import { getGovernmentPanelListApi } from "@/services/governmentPanel.service";
import { uploadImageApi } from "@/services/category.services";

/* ---------- TYPES ---------- */

type InsuranceCompany = {
  _id: string;
  insuranceCompany: string;
};

type CashlessCompany = {
  _id: string;
  cashlessInsuranceCompany: string;
};

type GovernmentPanel = {
  _id: string;
  panelName: string;
};

type Props = {
  data: HospitalFormData;
  onChange: (val: Partial<HospitalFormData>) => void;
  onSubmit: () => void;
};

/* ---------- COMPONENT ---------- */

export default function HospitalInformationStep({
  data,
  onChange,
  onSubmit,
}: Props) {
  const [insuranceCompanies, setInsuranceCompanies] = useState<
    InsuranceCompany[]
  >([]);
  const [cashlessCompanies, setCashlessCompanies] = useState<
    CashlessCompany[]
  >([]);
  const [governmentPanels, setGovernmentPanels] = useState<
    GovernmentPanel[]
  >([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---------- FETCH DROPDOWNS ---------- */
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [i, c, g] = await Promise.all([
          fetchInsuranceCompaniesApi(),
          getCashlessInsuranceListApi(),
          getGovernmentPanelListApi(),
        ]);

        setInsuranceCompanies(i.data ?? []);
        setCashlessCompanies(c.data ?? []);
        setGovernmentPanels(g.data ?? []);
      } catch (error) {
        console.error("Failed to fetch master data", error);
      }
    };

    fetchMasterData();
  }, []);

  /* ---------- VALIDATION ---------- */

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.treatmentList.length) {
      newErrors.treatmentList = "Select at least one insurance company";
    }

    if (!data.cashlessList.length) {
      newErrors.cashlessList = "Select at least one cashless company";
    }

    if (!data.panelList.length) {
      newErrors.panelList = "Select at least one government panel";
    }

    if (!data.imageUrls.length) {
      newErrors.imageUrls = "Upload at least one hospital image";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ---------- HELPERS ---------- */

  const addItem = (
    key: "treatmentList" | "cashlessList" | "panelList",
    id: string
  ) => {
    if (!id || data[key].includes(id)) return;

    onChange({ [key]: [...data[key], id] });

    // Remove error when fixed
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const removeItem = (
    key: "treatmentList" | "cashlessList" | "panelList",
    index: number
  ) => {
    const updated = [...data[key]];
    updated.splice(index, 1);
    onChange({ [key]: updated });
  };

  /* ---------- IMAGE UPLOAD ---------- */

  const uploadImages = async (files: File[]) => {
    try {
      setUploading(true);

      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const res = await uploadImageApi(file);
          return res?.success ? res.file.url : null;
        })
      );

      const validUrls = uploadedUrls.filter(
        (url): url is string => Boolean(url)
      );

      onChange({
        imageUrls: [...data.imageUrls, ...validUrls].slice(0, 10),
      });

      // Clear image error
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.imageUrls;
        return copy;
      });
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="col-span-2 space-y-8">

          {/* Treatment */}
          <Section title="Treatment Providing">
            <Select
              label="Insurance Company"
              options={insuranceCompanies}
              getLabel={(i) => i.insuranceCompany}
              onSelect={(id) => addItem("treatmentList", id)}
            />

            <Chips
              ids={data.treatmentList}
              getName={(id) =>
                insuranceCompanies.find((i) => i._id === id)
                  ?.insuranceCompany || id
              }
              onRemove={(i) => removeItem("treatmentList", i)}
            />

            {errors.treatmentList && (
              <p className="text-red-500 text-xs mt-1">
                {errors.treatmentList}
              </p>
            )}
          </Section>

          {/* Cashless */}
          <Section title="Cashless Insurance Companies">
            <Select
              label="Cashless Insurance"
              options={cashlessCompanies}
              getLabel={(i) => i.cashlessInsuranceCompany}
              onSelect={(id) => addItem("cashlessList", id)}
            />

            <Chips
              ids={data.cashlessList}
              getName={(id) =>
                cashlessCompanies.find((i) => i._id === id)
                  ?.cashlessInsuranceCompany || id
              }
              onRemove={(i) => removeItem("cashlessList", i)}
            />

            {errors.cashlessList && (
              <p className="text-red-500 text-xs mt-1">
                {errors.cashlessList}
              </p>
            )}
          </Section>

          {/* Panel */}
          <Section title="Government Panel">
            <Select
              label="Panel"
              options={governmentPanels}
              getLabel={(i) => i.panelName}
              onSelect={(id) => addItem("panelList", id)}
            />

            <Chips
              ids={data.panelList}
              getName={(id) =>
                governmentPanels.find((i) => i._id === id)?.panelName || id
              }
              onRemove={(i) => removeItem("panelList", i)}
            />

            {errors.panelList && (
              <p className="text-red-500 text-xs mt-1">
                {errors.panelList}
              </p>
            )}
          </Section>

          {/* Hospital Details */}
          <Section title="Hospital Details">
            <textarea
              className="w-full border px-3 py-2 rounded-md min-h-[100px]"
              placeholder="Enter hospital details..."
              value={data.hospitaldetails || ""}
              onChange={(e) => onChange({ hospitaldetails: e.target.value })}
            />
          </Section>

          {/* Submit */}
          <button
            disabled={uploading}
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-8 py-2 rounded disabled:opacity-50"
          >
            Submit Hospital
          </button>
        </div>

        {/* RIGHT — IMAGE UPLOAD */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Hospital Images</h2>

          <div
            onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
            onDrop={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              uploadImages(Array.from(e.dataTransfer.files));
            }}
            className="border-2 border-dashed rounded-lg p-6 min-h-[200px] flex flex-col items-center justify-center"
          >
            <ImageIcon className="w-10 h-10 text-gray-500 mb-2" />

            <p className="text-sm">Drag images here or</p>

            <label className="text-blue-600 underline cursor-pointer">
              Browse Images

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  uploadImages(Array.from(e.target.files ?? []))
                }
              />
            </label>

            <p className="text-xs text-gray-500 mt-2">Max 10 images</p>
          </div>

          {errors.imageUrls && (
            <p className="text-red-500 text-xs mt-2">
              {errors.imageUrls}
            </p>
          )}

          {data.imageUrls.length > 0 && (
            <div className="mt-3 space-y-1">
              {data.imageUrls.map((url: any, i: number) => (
                <p key={i} className="text-xs text-green-600 truncate">
                  {url}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}

function Select<T extends { _id: string }>({
  label,
  options,
  getLabel,
  onSelect,
}: {
  label: string;
  options: T[];
  getLabel: (item: T) => string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mb-3">
      <label className="text-sm">{label}</label>

      <div className="relative">
        <select
          className="border px-3 py-2 w-full"
          onChange={(e) => onSelect(e.target.value)}
        >
          <option value="">Select</option>

          {options.map((o) => (
            <option key={o._id} value={o._id}>
              {getLabel(o)}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute right-2 top-3 h-4 w-4" />
      </div>
    </div>
  );
}

function Chips({
  ids,
  getName,
  onRemove,
}: {
  ids: string[];
  getName: (id: string) => string;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ids.map((id, i) => (
        <span
          key={id}
          className="bg-gray-200 px-3 py-1 rounded-full text-sm"
        >
          {getName(id)}

          <button
            className="ml-2"
            onClick={() => onRemove(i)}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}
  