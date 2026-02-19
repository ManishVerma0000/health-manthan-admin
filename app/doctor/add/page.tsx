"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { getHospitalList } from "@/services/hospital.service";
import { uploadImageApi } from "@/services/upload.services";
import {
  createDoctorApi,
  getDoctorById,
  updateDoctorApi,
} from "@/services/doctor.service";
import Header from "@/components/Header";

function AddDoctorPage() {
  /* ================= STATES ================= */

  const [treatments, setTreatments] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const [form, setForm] = useState({
    hospital: "",
    name: "",
    contactNumber: "",
    whatsAppNumber: "",
    workingFrom: "",
    qualificationAndExperience: "",
    about: "",
    status: false,
  });

  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [timings, setTimings] = useState<{ day: string; time: string }[]>([]);

  const [timingInput, setTimingInput] = useState({
    day: "",
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState<any>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const [isEditMode, setIsEditMode] = useState(false);

  /* ================= HELPERS ================= */

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= IMAGE AUTO UPLOAD ================= */

  const uploadTimeout = useRef<any>(null);

  useEffect(() => {
    if (!imageFile) return;

    if (uploadTimeout.current) {
      clearTimeout(uploadTimeout.current);
    }

    uploadTimeout.current = setTimeout(() => {
      autoUploadImage();
    }, 300);
  }, [imageFile]);

  const autoUploadImage = async () => {
    if (!imageFile) return;

    try {
      const res = await uploadImageApi(imageFile);

      if (!res?.success) throw new Error("Upload failed");

      setImageUrl(res?.file?.url ?? "");
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  /* ================= FETCH HOSPITAL ================= */

  useEffect(() => {
    fetchHospitals();
  }, []);

  /* ================= PREFILL WHEN EDITING ================= */

  useEffect(() => {
    const loadDoctorForEdit = async () => {
      if (!editId) return;

      try {
        setLoading(true);
        const res = await getDoctorById(editId);
        const doctor = res?.data;
        if (!doctor) return;

        setForm({
          hospital: doctor.hospital?._id || doctor.hospital || "",
          name: doctor.name || "",
          contactNumber: doctor.contactNumber || "",
          whatsAppNumber: doctor.whatsAppNumber || "",
          workingFrom: doctor.workingFrom
            ? new Date(doctor.workingFrom).toISOString().slice(0, 10)
            : "",
          qualificationAndExperience:
            doctor.qualificationAndExperience || "",
          about: doctor.about || "",
          status: doctor.status ?? true,
        });

        setTreatments(
          Array.isArray(doctor.treatmentProvide)
            ? doctor.treatmentProvide.join(", ")
            : doctor.treatmentProvide || ""
        );

        setTimings(doctor.timings || []);

        setImageUrl(
          Array.isArray(doctor.imageUrl)
            ? doctor.imageUrl[0] || ""
            : doctor.imageUrl || ""
        );

        setIsActive(doctor.status ?? true);
        setIsEditMode(true);
      } catch (error) {
        console.error("Failed to load doctor for edit:", error);
        showToast("Failed to load doctor details", "error");
      } finally {
        setLoading(false);
      }
    };

    loadDoctorForEdit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);

      const res = await getHospitalList();

      if (res?.success) {
        setHospitals(res?.data ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= IMAGE HANDLERS ================= */

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file) setImageFile(file);
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    let newErrors: any = {};

    if (!form.hospital) newErrors.hospital = "Hospital is required";

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(form.contactNumber)) {
      newErrors.contactNumber = "Enter valid 10 digit number";
    }

    if (!form.whatsAppNumber.trim()) {
      newErrors.whatsAppNumber = "Whatsapp number is required";
    } else if (!/^[0-9]{10}$/.test(form.whatsAppNumber)) {
      newErrors.whatsAppNumber = "Enter valid 10 digit number";
    }

    if (!treatments.trim()) newErrors.treatments = "Treatment is required";

    if (timings.length === 0) newErrors.timings = "Add at least one timing";

    if (!form.about.trim()) newErrors.about = "About is required";

    if (!form.workingFrom)
      newErrors.workingFrom = "Working from date is required";

    if (!form.qualificationAndExperience.trim())
      newErrors.qualificationAndExperience = "Qualification is required";

    if (!imageUrl) newErrors.image = "Image is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = {
      name: form.name,
      hospital: form.hospital,
      contactNumber: form.contactNumber,
      whatsAppNumber: form.whatsAppNumber,
      workingFrom: form.workingFrom,
      qualificationAndExperience: form.qualificationAndExperience,
      treatmentProvide: treatments,
      timings: timings,
      about: form.about,
      imageUrl: imageUrl,
      status: isActive,
    };
    try {
      const res =
        isEditMode && editId
          ? await updateDoctorApi(editId, payload)
          : await createDoctorApi(payload);
      if (!res?.success) throw new Error("Failed");
      showToast(
        isEditMode
          ? "Doctor updated successfully 🎉"
          : "Doctor created successfully 🎉",
        "success"
      );

      if (isEditMode) {
        router.push("/doctor/list");
      }
    } catch (err) {
      console.error(err);
      showToast(
        isEditMode ? "Error updating doctor" : "Error creating doctor",
        "error"
      );
    }
  };
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  /* ================= UI ================= */

  return (
    <div>
      <Header />
      <div className="p-8">
        <h2 className="text-lg font-semibold mb-6">Doctor Detail</h2>

        <div className="grid grid-cols-3 gap-10">
          {/* LEFT FORM */}
          <div className="col-span-2 space-y-6 text-sm">
            {/* Hospital */}
            <div>
              <label>Hospital *</label>

              <select
                className="border w-full px-3 py-2 rounded mt-1"
                value={form.hospital}
                onChange={(e) => update("hospital", e.target.value)}
              >
                <option value="">
                  {loading ? "Loading..." : "Select Hospital"}
                </option>

                {hospitals.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.hospitalName} — {h.city}
                  </option>
                ))}
              </select>

              {errors.hospital && (
                <p className="text-red-500 text-xs">{errors.hospital}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label>Name *</label>
              <input
                className="border w-full px-3 py-2 rounded mt-1"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />

              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label>Contact *</label>
              <input
                className="border w-full px-3 py-2 rounded mt-1"
                value={form.contactNumber}
                onChange={(e) => update("contactNumber", e.target.value)}
              />

              {errors.contactNumber && (
                <p className="text-red-500 text-xs">{errors.contactNumber}</p>
              )}
            </div>

            {/* Whatsapp */}
            <div>
              <label>Whatsapp *</label>
              <input
                className="border w-full px-3 py-2 rounded mt-1"
                value={form.whatsAppNumber}
                onChange={(e) => update("whatsAppNumber", e.target.value)}
              />

              {errors.whatsAppNumber && (
                <p className="text-red-500 text-xs">{errors.whatsAppNumber}</p>
              )}
            </div>

            {/* Treatment */}
            <div>
              <label>Treatment *</label>
              <input
                className="border w-full px-3 py-2 rounded mt-1"
                value={treatments}
                onChange={(e) => setTreatments(e.target.value)}
              />

              {errors.treatments && (
                <p className="text-red-500 text-xs">{errors.treatments}</p>
              )}
            </div>

            {/* Timings */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label>Timings *</label>
                <button
                  type="button"
                  className="text-green-600 text-sm font-medium"
                  onClick={() => {
                    if (
                      !timingInput.day ||
                      !timingInput.startTime ||
                      !timingInput.endTime
                    )
                      return;

                    const formattedTime = `${timingInput.startTime} to ${timingInput.endTime}`;
                    setTimings([
                      ...timings,
                      { day: timingInput.day, time: formattedTime },
                    ]);

                    setTimingInput({ day: "", startTime: "", endTime: "" });
                  }}
                >
                  + Add Timing
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-1">
                <select
                  className="border px-3 py-2 rounded"
                  value={timingInput.day}
                  onChange={(e) =>
                    setTimingInput({
                      ...timingInput,
                      day: e.target.value,
                    })
                  }
                >
                  <option value="">Select Day</option>
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <input
                  className="border px-3 py-2 rounded"
                  placeholder="5AM"
                  value={timingInput.startTime}
                  onChange={(e) =>
                    setTimingInput({
                      ...timingInput,
                      startTime: e.target.value,
                    })
                  }
                />

                <span className="flex items-center justify-center text-gray-500">
                  to
                </span>

                <input
                  className="border px-3 py-2 rounded"
                  placeholder="5PM"
                  value={timingInput.endTime}
                  onChange={(e) =>
                    setTimingInput({
                      ...timingInput,
                      endTime: e.target.value,
                    })
                  }
                />
              </div>

              {/* Display Added Timings */}
              {timings.length > 0 && (
                <div className="mt-3 space-y-2">
                  {timings.map((timing, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                    >
                      <span className="text-sm">
                        <span className="font-medium">{timing.day}</span>:{" "}
                        {timing.time}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...timings];
                          updated.splice(index, 1);
                          setTimings(updated);
                        }}
                        className="text-red-600 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.timings && (
                <p className="text-red-500 text-xs mt-2">{errors.timings}</p>
              )}
            </div>

            {/* About */}
            <div>
              <label>About *</label>
              <input
                className="border w-full px-3 py-2 rounded mt-1"
                value={form.about}
                onChange={(e) => update("about", e.target.value)}
              />

              {errors.about && (
                <p className="text-red-500 text-xs">{errors.about}</p>
              )}
            </div>

            {/* Working From */}
            <div>
              <label>Working From *</label>

              <input
                type="date"
                className="border w-full px-3 py-2 rounded mt-1"
                value={form.workingFrom}
                onChange={(e) => update("workingFrom", e.target.value)}
              />

              {errors.workingFrom && (
                <p className="text-red-500 text-xs">{errors.workingFrom}</p>
              )}
            </div>

            {/* Qualification */}
            <div>
              <label>Qualification *</label>

              <input
                className="border w-full px-3 py-2 rounded mt-1"
                value={form.qualificationAndExperience}
                onChange={(e) =>
                  update("qualificationAndExperience", e.target.value)
                }
              />

              {errors.qualificationAndExperience && (
                <p className="text-red-500 text-xs">
                  {errors.qualificationAndExperience}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="flex gap-4 items-center">
              <label>Status</label>

              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`px-4 py-2 rounded text-white ${
                  isActive ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded mt-6"
            >
              Submit Doctor
            </button>
          </div>

          {/* IMAGE */}
          <div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed rounded p-6 flex flex-col items-center"
            >
              <ImageIcon size={50} className="text-gray-400 mb-2" />

              <p>Drag image or</p>

              <label className="text-orange-600 underline cursor-pointer">
                Browse
                <input hidden type="file" onChange={handleBrowse} />
              </label>
            </div>

            {errors.image && (
              <p className="text-red-500 text-xs mt-2">{errors.image}</p>
            )}

            {imageFile && <p className="text-sm mt-2">{imageFile.name}</p>}

            {imageUrl && (
              <p className="text-green-600 text-xs mt-2 break-all">
                {imageUrl}
              </p>
            )}
          </div>
        </div>
      </div>

      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded shadow-lg text-white text-sm
      ${
        toast.type === "success"
          ? "bg-green-600"
          : toast.type === "error"
            ? "bg-red-600"
            : "bg-blue-600"
      }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}


export default function Page() {  // ← add this at the bottom
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddDoctorPage />
    </Suspense>
  );
}