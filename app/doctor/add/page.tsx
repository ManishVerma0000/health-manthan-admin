"use client";

import { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, X, PlusCircle } from "lucide-react";
import { getHospitalList } from "@/services/hospital.service";
import { uploadImageApi } from "@/services/upload.services";
import { createDoctorApi } from "@/services/doctor.service";

export default function AddDoctorPage() {
  const [treatments, setTreatments] = useState<string>("");
  // const [timings, setTimings] = useState<string>("");
  const [about, setAbout] = useState<string>("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  // FORM STATE
  const [form, setForm] = useState({
    hospital: "",
    contactNumber: "",
    whatsAppNumber: "",
    workingFrom: "",
    qualificationAndExperience: "",
    about: "",
  });

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ====================================================
  // AUTO IMAGE UPLOAD WITH DEBOUNCE
  // ====================================================
  const uploadTimeout = useRef<any>(null);

  useEffect(() => {
    if (!imageFile) return;

    if (uploadTimeout.current) {
      clearTimeout(uploadTimeout.current);
    }

    uploadTimeout.current = setTimeout(() => {
      autoUploadImage();
    }, 300); // debounce 300ms
  }, [imageFile]);

  const autoUploadImage = async () => {
    if (!imageFile) return;

    try {
      const res = await uploadImageApi(imageFile);

      if (!res.success) {
        throw new Error("Upload failed");
      }

      setImageUrl(res.file.url);
      console.log("Uploaded image URL:", res.file.url);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Image upload failed");
    }
  };

  const handleSubmit = async () => {
    if (!imageUrl) {
      alert("Image uploading… Please wait.");
      return;
    }

    const payload = {
      ...form,
      treatmentProvide: treatments,
      timings,
      about,
      imageUrl,
    };

    console.log("FINAL DOCTOR PAYLOAD:", payload);

    try {
      const res = await createDoctorApi(payload);

      if (!res.success) {
        throw new Error(res.message || "Failed");
      }

      alert("Doctor created successfully!");
    } catch (error) {
      console.error("Create doctor error:", error);
      alert("Error creating doctor");
    }
  };

  // ====================================================
  // IMAGE DRAG + DROP
  // ====================================================
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

  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [timings, setTimings] = useState<{ day: string; time: string }[]>([]);

  const [timingInput, setTimingInput] = useState({
    day: "",
    time: "",
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const res = await getHospitalList();
      if (res?.success) {
        setHospitals(res.data);
      }
    } catch (error) {
      console.error("Error fetching hospitals", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold mb-6">Doctor Detail</h2>

      <div className="grid grid-cols-3 gap-10">
        {/* LEFT FORM */}
        <div className="col-span-2 space-y-6 text-sm">
          {/* Hospital */}

          <div>
            <label className="block font-medium">
              Select Hospital <span className="text-red-500">*</span>
            </label>

            <select
              className="border w-full px-3 py-2 rounded-md mt-1 bg-white"
              value={form.hospital}
              onChange={(e) => update("hospital", e.target.value)}
            >
              <option value="">
                {loading ? "Loading hospitals..." : "Select Hospital"}
              </option>

              {hospitals.map((hospital) => (
                <option key={hospital._id} value={hospital._id}>
                  {hospital.hospitalName} — {hospital.city}
                </option>
              ))}
            </select>
          </div>

          {/* Contact */}
          <div>
            <label>Contact Number *</label>
            <input
              className="border w-full px-3 py-2 rounded-md mt-1"
              value={form.contactNumber}
              onChange={(e) => update("contactNumber", e.target.value)}
            />
          </div>

          {/* Whatsapp */}
          <div>
            <label>Whatsapp No *</label>
            <input
              className="border w-full px-3 py-2 rounded-md mt-1"
              value={form.whatsAppNumber}
              onChange={(e) => update("whatsAppNumber", e.target.value)}
            />
          </div>

          {/* Treatments */}
          <div>
            <label>Treatment Provide *</label>
            <input
              className="border w-full px-3 py-2 rounded-md mt-1"
              onChange={(e) => {
                setTreatments(e.target.value);
              }}
            />
          </div>

          {/* Timings */}

          {/* TIMINGS */}
          <div>
            <label className="block font-medium mb-1">
              Timings <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-2">
              <select
                className="border px-3 py-2 rounded-md"
                value={timingInput.day}
                onChange={(e) =>
                  setTimingInput({ ...timingInput, day: e.target.value })
                }
              >
                <option value="">Select Day</option>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <input
                className="border px-3 py-2 rounded-md"
                placeholder="9AM - 5PM"
                value={timingInput.time}
                onChange={(e) =>
                  setTimingInput({ ...timingInput, time: e.target.value })
                }
              />

              <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => {
                  if (!timingInput.day || !timingInput.time) return;

                  setTimings((prev) => [...prev, timingInput]);
                  setTimingInput({ day: "", time: "" });
                }}
              >
                Add
              </button>
            </div>

            {/* ADDED TIMINGS LIST */}
            {timings.length > 0 && (
              <div className="mt-3 space-y-2">
                {timings.map((t, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                  >
                    <span>
                      {t.day} — {t.time}
                    </span>

                    <button
                      type="button"
                      className="text-red-500 text-sm"
                      onClick={() =>
                        setTimings((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* About */}
          <div>
            <label>About *</label>
            <input
              className="border w-full px-3 py-2 rounded-md mt-1"
              placeholder="Add About Lines"
              onChange={(e) => {
                setAbout(e.target.value);
              }}
            />
          </div>

          {/* Working from */}
          <div>
            <label>Working From *</label>
            <input
              className="border w-full px-3 py-2 rounded-md mt-1"
              value={form.workingFrom}
              onChange={(e) => update("workingFrom", e.target.value)}
            />
          </div>

          {/* Qualification */}
          <div>
            <label>Qualification & Experience *</label>
            <input
              className="border w-full px-3 py-2 rounded-md mt-1"
              value={form.qualificationAndExperience}
              onChange={(e) =>
                update("qualificationAndExperience", e.target.value)
              }
            />
          </div>

          {/* SUBMIT */}
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded mt-6"
            onClick={handleSubmit}
          >
            Submit Doctor
          </button>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center"
          >
            <ImageIcon size={50} className="text-gray-400 mb-3" />
            <p>Drag Image or</p>

            <label className="text-orange-600 underline cursor-pointer">
              Browse
              <input type="file" className="hidden" onChange={handleBrowse} />
            </label>
          </div>

          {imageFile && <p className="text-sm mt-2">{imageFile.name}</p>}

          {imageUrl && (
            <p className="text-green-600 text-xs mt-2 break-all">
              Uploaded URL: {imageUrl}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
