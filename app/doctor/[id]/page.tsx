"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock, Building2 } from "lucide-react";
import { useParams } from "next/navigation";

import Header from "@/components/Header";
import { getDoctorById } from "@/services/doctor.service";

/* ---------------- Types ---------------- */

interface Timing {
  day: string;
  time: string;
}

interface Hospital {
  hospitalName?: string;
  city?: string;
  location?: string;
  contactNumber?: string;
  email?: string;
  iconUrl?: string;
}

interface DoctorData {
  name?: string;
  contactNumber?: string;
  whatsAppNumber?: string;
  qualificationAndExperience?: string;
  about?: string;
  workingFrom?: string;
  imageUrl?: string[];
  timings?: Timing[];
  hospital?: Hospital; // ✅ Added
}

/* ---------------- Component ---------------- */

export default function DoctorDetailsPage() {
  const [doctor, setDoctor] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params?.id as string;

  /* ---------------- Fetch Doctor ---------------- */

  useEffect(() => {
    if (!id) return;

    const fetchDoctor = async () => {
      try {
        const res = await getDoctorById(id);

        setDoctor(res?.data);
      } catch (err) {
        console.error("Doctor API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  /* ---------------- No Data ---------------- */

  if (!doctor) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Doctor Not Found
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-xl font-bold">
            Doctor Profile
          </h1>

        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* ================= Doctor Card ================= */}

        <div className="bg-white rounded-xl shadow p-6">

          {/* Top Section */}
          <div className="flex gap-6 mb-6">

            <img
              src={doctor?.imageUrl?.[0]}
              alt="Doctor"
              className="w-32 h-32 rounded-xl object-cover"
            />

            <div>

              <h2 className="text-2xl font-bold mb-2">
                {doctor?.name || "Doctor"}
              </h2>

              <p className="text-gray-600 mb-2">
                {doctor?.qualificationAndExperience}
              </p>

              <p className="text-sm text-gray-500">
                Working Since: {doctor?.workingFrom}
              </p>

            </div>

          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-600" />
              <span>{doctor?.contactNumber}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-600" />
              <span>{doctor?.whatsAppNumber}</span>
            </div>

          </div>

          {/* About */}
          <div className="mb-6">

            <h3 className="font-semibold mb-2">
              About Doctor
            </h3>

            <p className="text-gray-600">
              {doctor?.about}
            </p>

          </div>

          {/* Timings */}
          <div>

            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock size={18} />
              Timings
            </h3>

            <div className="space-y-2">

              {doctor?.timings?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm bg-indigo-50 px-3 py-2 rounded"
                >
                  <span>{item?.day}</span>
                  <span>{item?.time}</span>
                </div>
              ))}

              {(!doctor?.timings || doctor?.timings?.length === 0) && (
                <p className="text-gray-500 text-sm">
                  No timings available
                </p>
              )}

            </div>

          </div>

        </div>

        {/* ================= Hospital Card ================= */}

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 size={20} />
            Hospital Information
          </h3>

          <div className="flex gap-4 mb-4">

            <img
              src={doctor?.hospital?.iconUrl}
              alt="Hospital"
              className="w-20 h-20 rounded-lg object-cover"
            />

            <div>

              <h4 className="font-bold text-lg">
                {doctor?.hospital?.hospitalName}
              </h4>

              <p className="text-sm text-gray-600">
                {doctor?.hospital?.location},{" "}
                {doctor?.hospital?.city}
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{doctor?.hospital?.contactNumber}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-600" />
              <span>{doctor?.hospital?.email}</span>
            </div>

            <div className="flex items-center gap-2 md:col-span-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span>
                {doctor?.hospital?.location},{" "}
                {doctor?.hospital?.city}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
