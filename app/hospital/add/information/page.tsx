"use client";

import { useEffect, useState, DragEvent, ChangeEvent } from "react";
import { ChevronDown, ImageIcon } from "lucide-react";
import { HospitalFormData } from "../../page";
import { getCashlessInsuranceListApi } from "@/services/cashlessInsurance.service";
import { getGovernmentPanelListApi } from "@/services/governmentPanel.service";
import { uploadImageApi } from "@/services/upload.services";

const API_BASE = "http://localhost:3000";

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
  const [cashlessCompanies, setCashlessCompanies] = useState<CashlessCompany[]>(
    []
  );
  const [governmentPanels, setGovernmentPanels] = useState<GovernmentPanel[]>(
    []
  );
  const [uploading, setUploading] = useState<boolean>(false);

  /* ---------- FETCH DROPDOWNS ---------- */

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [insuranceRes, cashlessRes, governmentRes] = await Promise.all([
          getCashlessInsuranceListApi(),
          getCashlessInsuranceListApi(),
          getGovernmentPanelListApi(),
        ]);

        setInsuranceCompanies(insuranceRes.data ?? []);
        setCashlessCompanies(cashlessRes.data ?? []);
        setGovernmentPanels(governmentRes.data ?? []);
      } catch (error) {
        console.error("❌ Error loading lookup data:", error);
      }
    };

    fetchLookups();
  }, []);

  /* ---------- HELPERS ---------- */

  const addItem = (
    key: "treatmentList" | "cashlessList" | "panelList",
    id: string
  ) => {
    if (!id || data[key].includes(id)) return;
    onChange({ [key]: [...data[key], id] });
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

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const res = await uploadImageApi(file);
      return res?.success ? res.file.url : null;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadImages = async (files: File[]) => {
    const urls: string[] = [];

    for (const file of files) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }

    onChange({
      imageUrls: [...data.imageUrls, ...urls].slice(0, 10),
    });
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
              getLabel={(i) => i?.insuranceCompany}
              onSelect={(id) => addItem("treatmentList", id)}
            />
            <Chips
              ids={data?.treatmentList}
              getName={(id) =>
                insuranceCompanies?.find((i) => i?._id === id)
                  ?.insuranceCompany || id
              }
              onRemove={(i) => removeItem("treatmentList", i)}
            />
          </Section>

          {/* Cashless */}
          <Section title="Cashless Insurance Companies">
            <Select
              label="Cashless Insurance"
              options={cashlessCompanies}
              getLabel={(i) => i?.cashlessInsuranceCompany}
              onSelect={(id) => addItem("cashlessList", id)}
            />
            <Chips
              ids={data?.cashlessList}
              getName={(id) =>
                cashlessCompanies?.find((i) => i._id === id)
                  ?.cashlessInsuranceCompany || id
              }
              onRemove={(i) => removeItem("cashlessList", i)}
            />
          </Section>

          {/* Panel */}
          <Section title="Government Panel">
            <Select
              label="Panel"
              options={governmentPanels}
              getLabel={(i) => i?.panelName}
              onSelect={(id) => addItem("panelList", id)}
            />
            <Chips
              ids={data?.panelList}
              getName={(id) =>
                governmentPanels.find((i) => i?._id === id)?.panelName || id
              }
              onRemove={(i) => removeItem("panelList", i)}
            />
          </Section>

          <button
            onClick={onSubmit}
            className="bg-blue-600 text-white px-8 py-2 rounded"
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

          {data?.imageUrls?.length > 0 && (
            <div className="mt-3 space-y-1">
              {data?.imageUrls?.map((url: any, i: number) => (
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
      {ids?.map((id, i) => (
        <span key={id} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
          {getName(id)}
          <button className="ml-2" onClick={() => onRemove(i)}>
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}



