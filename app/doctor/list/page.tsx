"use client";

import { useEffect, useState } from "react";
import { getDoctorList } from "@/services/doctor.service";

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await getDoctorList();
      if (res.success) {
        setDoctors(res.data);
      }
    } catch (error) {
      console.error("Error fetching doctors", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading doctors...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Doctor List</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Doctor Image</th>
              <th className="px-4 py-3">Hospital</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Timings</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id} className="border-t hover:bg-gray-50">
                {/* IMAGE */}
                <td className="px-4 py-3">
                  <img
                    src={doctor?.imageUrl?.[0]}
                    alt="Doctor"
                    className="w-14 h-14 rounded object-cover"
                  />
                </td>

                {/* HOSPITAL */}
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {doctor.hospital?.hospitalName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {doctor.hospital?.city}
                  </div>
                </td>

                {/* CONTACT */}
                <td className="px-4 py-3">
                  <div>{doctor.contactNumber}</div>
                  <div className="text-xs text-gray-500">
                    WhatsApp: {doctor.whatsAppNumber}
                  </div>
                </td>

                {/* TIMINGS */}
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    {doctor.timings.map((t: any) => (
                      <div
                        key={t._id}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {t.day}: {t.time}
                      </div>
                    ))}
                  </div>
                </td>

                {/* EXPERIENCE */}
                <td className="px-4 py-3">
                  {doctor.qualificationAndExperience}
                </td>

                {/* CREATED */}
                <td className="px-4 py-3 text-xs text-gray-500">
                  {new Date(doctor.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {doctors.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No doctors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
