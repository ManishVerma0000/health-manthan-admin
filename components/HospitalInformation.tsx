"use client";

import { useEffect, useState, DragEvent, ChangeEvent } from "react";
import { ChevronDown, ImageIcon, X, Loader2 } from "lucide-react";
import { HospitalFormData } from "@/type/hospital";
import { fetchInsuranceCompaniesApi } from "@/services/insuranceCompany.service";
import { getCashlessInsuranceListApi } from "@/services/cashlessInsurance.service";
import { getGovernmentPanelListApi } from "@/services/governmentPanel.service";
import { uploadImageApi } from "@/services/category.services";
import Button from "@/components/Button";

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
  const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>([]);
  const [cashlessCompanies, setCashlessCompanies] = useState<CashlessCompany[]>([]);
  const [governmentPanels, setGovernmentPanels] = useState<GovernmentPanel[]>([]);
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

        setInsuranceCompanies(i?.data ?? []);
        setCashlessCompanies(c?.data ?? []);
        setGovernmentPanels(g?.data ?? []);
      } catch (error) {
        console.error("Failed to fetch master data", error);
      }
    };

    fetchMasterData();
  }, []);

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data?.treatmentList?.length) newErrors.treatmentList = "Select at least one insurance company";
    if (!data?.cashlessList?.length) newErrors.cashlessList = "Select at least one cashless company";
    if (!data?.panelList?.length) newErrors.panelList = "Select at least one government panel";
    if (!data?.imageUrls?.length) newErrors.imageUrls = "Upload at least one hospital image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------- HELPERS ---------- */
  const addItem = (key: "treatmentList" | "cashlessList" | "panelList", id: string) => {
    if (!id || data?.[key]?.includes(id)) return;
    onChange({ [key]: [...(data?.[key] ?? []), id] });
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const removeItem = (key: "treatmentList" | "cashlessList" | "panelList", index: number) => {
    const updated = [...(data?.[key] ?? [])];
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
          return res?.success ? res?.file?.url ?? null : null;
        })
      );

      const validUrls = uploadedUrls.filter((url): url is string => Boolean(url));
      onChange({ imageUrls: [...(data?.imageUrls ?? []), ...validUrls].slice(0, 10) });

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

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          {/* Treatment */}
          <Section title="Treatment Providing" error={errors.treatmentList}>
            <Select
              label="Insurance Company"
              options={insuranceCompanies}
              getLabel={(i) => i.insuranceCompany}
              onSelect={(id) => addItem("treatmentList", id)}
            />
            <Chips
              ids={data?.treatmentList ?? []}
              getName={(id) => insuranceCompanies.find((i) => i._id === id)?.insuranceCompany || id}
              onRemove={(i) => removeItem("treatmentList", i)}
            />
          </Section>

          {/* Cashless */}
          <Section title="Cashless Insurance Companies" error={errors.cashlessList}>
            <Select
              label="Cashless Insurance"
              options={cashlessCompanies}
              getLabel={(i) => i.cashlessInsuranceCompany}
              onSelect={(id) => addItem("cashlessList", id)}
            />
            <Chips
              ids={data?.cashlessList ?? []}
              getName={(id) => cashlessCompanies.find((i) => i._id === id)?.cashlessInsuranceCompany || id}
              onRemove={(i) => removeItem("cashlessList", i)}
            />
          </Section>

          {/* Panel */}
          <Section title="Government Panel" error={errors.panelList}>
            <Select
              label="Panel"
              options={governmentPanels}
              getLabel={(i) => i.panelName}
              onSelect={(id) => addItem("panelList", id)}
            />
            <Chips
              ids={data?.panelList ?? []}
              getName={(id) => governmentPanels.find((i) => i._id === id)?.panelName || id}
              onRemove={(i) => removeItem("panelList", i)}
            />
          </Section>

          {/* Hospital Details */}
          <div>
            <h2 className="font-semibold mb-2 text-lg tracking-tight">Hospital Details</h2>
            <textarea
              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter detailed hospital information..."
              value={data?.hospitaldetails ?? ""}
              onChange={(e) => onChange({ hospitaldetails: e.target.value })}
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              isLoading={uploading}
              disabled={uploading}
              size="lg"
              className="w-full sm:w-auto"
            >
              Submit Hospital
            </Button>
          </div>
        </div>

        {/* RIGHT — IMAGE UPLOAD */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Hospital Images</h2>

          <div
            onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
            onDrop={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              uploadImages(Array.from(e.dataTransfer.files));
            }}
            className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg p-6 min-h-[200px] flex flex-col items-center justify-center bg-muted/5 transition-colors"
          >
            {uploading ? (
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            ) : (
              <ImageIcon className="w-10 h-10 text-muted-foreground mb-4" />
            )}

            <p className="text-sm font-medium mb-1">Drag images here</p>
            <p className="text-xs text-muted-foreground mb-4">or click to browse</p>

            <label className="cursor-pointer">
              <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('gallery-upload')?.click()}>
                Select Files
              </Button>
              <input
                id="gallery-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  uploadImages(Array.from(e.target.files ?? []))
                }
              />
            </label>
            <p className="text-xs text-muted-foreground mt-4">Max 10 images</p>
          </div>

          {errors.imageUrls && <p className="text-sm font-medium text-destructive">{errors.imageUrls}</p>}

          {data?.imageUrls?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {data.imageUrls.map((url: any, i: number) => (
                <div key={i} className="group relative aspect-video rounded-md overflow-hidden border border-border">
                  <img src={url} alt={`Hospital image ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(data?.imageUrls ?? [])];
                      updated.splice(i, 1);
                      onChange({ imageUrls: updated });
                    }}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
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
  error,
}: {
  title: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-lg tracking-tight">{title}</h2>
      {children}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
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
    <div className="space-y-1.5">
      <label className="text-sm font-medium leading-none">{label}</label>
      <div className="relative">
        <select
          className="flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(e) => {
            if (e.target.value) {
              onSelect(e.target.value);
              e.target.value = ""; // Reset after selection to allow re-selecting same if needed logic-wise, though typically not needed for specialized select
            }
          }}
          defaultValue=""
        >
          <option value="" disabled>Select option...</option>
          {options.map((o) => (
            <option key={o._id} value={o._id}>
              {getLabel(o)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />
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
  if (ids.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {ids.map((id, i) => (
        <span
          key={`${id}-${i}`}
          className="inline-flex items-center rounded-full border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {getName(id)}
          <button
            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={() => onRemove(i)}
          >
            <X size={14} className="text-muted-foreground hover:text-foreground" />
          </button>
        </span>
      ))}
    </div>
  );
}