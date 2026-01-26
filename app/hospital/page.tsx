"use client";

import { useState } from "react";
import HospitalDetailsStep from "@/components/HospitalButton";
import HospitalInformationStep from "@/components/HospitalInformation";
import { createHospitalApi } from "@/services/hospital.service";
import Header from "@/components/Header";
// import HospitalDetailsStep from "./add/page";
// import HospitalInformationStep from "./add/information/page";

/* ================= TYPES ================= */

export type HospitalFormData = {
  hospitalName: string;
  hospitalType: string;
  contactNumber: string;
  whatsapp: string;
  email: string;
  city: string;
  mapDirection: string;
  location: string;

  icon: File | null;
  images: File[];

  timings: {
    days: string;
    time: string;
  }[];

  iconUrl?: string;

  // STEP 2 (IDs ONLY)
  treatmentList: string[];
  cashlessList: string[];
  panelList: string[];
  imageUrls: string[];
};

/* ================= INITIAL STATE ================= */

const initialFormState: HospitalFormData = {
  hospitalName: "",
  hospitalType: "",
  contactNumber: "",
  whatsapp: "",
  email: "",
  city: "",
  mapDirection: "",
  location: "",

  icon: null,
  images: [],

  timings: [{ days: "", time: "" }],

  iconUrl: undefined,

  treatmentList: [],
  cashlessList: [],
  panelList: [],
  imageUrls: [],
};

/* ================= COMPONENT ================= */

export default function HospitalCreatePage() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<HospitalFormData>(initialFormState);
  const [loading, setLoading] = useState<boolean>(false);

  /* ---------- UPDATE FORM ---------- */

  const updateForm = (data: Partial<HospitalFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        hospitalName: formData.hospitalName,
        hospitalType: formData.hospitalType,
        contactNumber: formData.contactNumber,
        whatsapp: formData.whatsapp,
        email: formData.email,
        city: formData.city,
        mapDirection: formData.mapDirection,
        location: formData.location,
        iconUrl: formData.iconUrl,
        imageUrls: formData.imageUrls,
        timings: formData.timings,
        treatmentList: formData.treatmentList,
        cashlessList: formData.cashlessList,
        panelList: formData.panelList,
      };
      const result = await createHospitalApi(payload);
      if (!result.success) {
        throw new Error(result.message || "Hospital creation failed");
      }
      console.log("✅ Hospital created:", result.data);
      setFormData(initialFormState);
      setStep(1);
      alert("Hospital created successfully 🎉");
    } catch (error: any) {
      console.error("❌ Error creating hospital:", error);
      alert(error.message || "Something went wrong while creating hospital");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <>
    <Header/>
      {step === 1 && (
        <HospitalDetailsStep
          data={formData}
          onChange={updateForm}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <HospitalInformationStep
          data={formData}
          onChange={updateForm}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
