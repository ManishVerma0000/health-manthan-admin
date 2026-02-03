"use client";

import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Star } from "lucide-react";
import { useParams } from "next/navigation";

import Header from "@/components/Header";
import { getHospitalById } from "@/services/hospital.service";
import { getDoctorsByHospital } from "@/services/doctor.service";

/* ================= TYPES ================= */

interface DoctorData {
  _id: string;
  name: string;
  qualificationAndExperience: string;
  workingFrom: string;
  imageUrl: string[];
}

interface TabType {
  id: string;
  label: string;
}

interface Timing {
  days: string;
  time: string;
}

interface HospitalData {
  hospitalName: string;
  contactNumber: string;
  whatsapp: string;
  email: string;
  city: string;
  location: string;
  mapDirection: string;
  iconUrl: string;
  imageUrls: string[];
  timings: Timing[];

  // POPULATED DATA
  treatmentList: {
    _id: string;
    insuranceCompany: string;
  }[];

  cashlessList: {
    _id: string;
    cashlessInsuranceCompany: string;
  }[];

  panelList: {
    _id: string;
    panelName: string;
  }[];
}

/* ================= COMPONENT ================= */

const HospitalProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("insurance");
  const [hospital, setHospital] = useState<HospitalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [doctorLoading, setDoctorLoading] = useState(false);

  const params = useParams();
  const id = params?.id as string;

  /* ================= TABS ================= */

  const tabs: TabType[] = [
    { id: "insurance", label: "Insurance" },
    { id: "cashless", label: "Cashless" },
    { id: "government", label: "Government" },
    { id: "doctors", label: "Doctors" },
    { id: "stories", label: "Stories" },
  ];

  /* ================= FETCH ================= */

  /* ================= FETCH DOCTORS ================= */

  const fetchDoctors = async () => {
    if (!id) return;

    try {
      setDoctorLoading(true);

      const res = await getDoctorsByHospital(id);

      if (res?.success) {
        setDoctors(res.data || []);
      }
    } catch (err) {
      console.error("Doctor API Error:", err);
    } finally {
      setDoctorLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "doctors" && doctors.length === 0) {
      fetchDoctors();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!id) return;

    const fetchHospital = async () => {
      try {
        const res = await getHospitalById(id);
        setHospital(res?.data ?? null);
      } catch (err) {
        console.error("Hospital API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        No Hospital Found
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ================= HEADER ================= */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">{hospital?.hospitalName}</h1>

          <button className="text-blue-600 text-sm font-medium">
            Edit Hospital
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= LEFT ================= */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm rounded-lg p-6">
              {/* IMAGE */}
              <div className="flex items-start mb-4">
                <img
                  src={hospital?.iconUrl}
                  alt={hospital?.hospitalName}
                  className="w-20 h-20 rounded-lg object-cover mr-4"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">
                    {hospital?.hospitalName}
                  </h2>

                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}

                    <span className="ml-2 text-sm font-semibold">220</span>

                    <span className="ml-1 text-sm text-gray-500">ratings</span>
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex items-start mb-4">
                <MapPin className="w-4 h-4 mt-1 mr-2 text-gray-500" />

                <p className="text-sm text-gray-600">
                  {hospital?.location}, {hospital?.city}
                </p>
              </div>

              {/* DIRECTION */}
              <a
                href={hospital?.mapDirection}
                target="_blank"
                className="w-full mb-6 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex justify-center text-sm font-medium"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Direction
              </a>

              {/* CONTACT */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">
                    {hospital?.contactNumber}
                  </span>
                </div>

                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">
                    {hospital?.whatsapp}
                  </span>
                </div>

                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">{hospital?.email}</span>
                </div>
              </div>

              {/* TIMING */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-bold mb-3">Timing</h3>

                <div className="space-y-2">
                  {hospital?.timings?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.days}</span>

                      <span className="text-gray-900">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {/* ================= TABS ================= */}
              <div className="border-b">
                <nav className="flex -mb-px">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium
                        ${
                          activeTab === tab.id
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* ================= CONTENT ================= */}
              <div className="p-6">
                {/* INSURANCE */}
                {activeTab === "insurance" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Insurance Providers
                    </h3>

                    <ul className="space-y-3">
                      {hospital?.treatmentList?.map((item) => (
                        <li
                          key={item._id}
                          className="p-3 border rounded bg-gray-50"
                        >
                          {item.insuranceCompany}
                        </li>
                      ))}

                      {hospital?.treatmentList?.length === 0 && (
                        <p className="text-gray-500">No insurance available</p>
                      )}
                    </ul>
                  </div>
                )}

                {/* CASHLESS */}
                {activeTab === "cashless" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Cashless Insurance
                    </h3>

                    <ul className="space-y-3">
                      {hospital?.cashlessList?.map((item) => (
                        <li
                          key={item._id}
                          className="p-3 border rounded bg-gray-50"
                        >
                          {item.cashlessInsuranceCompany}
                        </li>
                      ))}

                      {hospital?.cashlessList?.length === 0 && (
                        <p className="text-gray-500">No cashless insurance</p>
                      )}
                    </ul>
                  </div>
                )}

                {/* GOVERNMENT */}
                {activeTab === "government" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Government Panels
                    </h3>

                    <ul className="space-y-3">
                      {hospital?.panelList?.map((item) => (
                        <li
                          key={item._id}
                          className="p-3 border rounded bg-gray-50"
                        >
                          {item.panelName}
                        </li>
                      ))}

                      {hospital?.panelList?.length === 0 && (
                        <p className="text-gray-500">No government panel</p>
                      )}
                    </ul>
                  </div>
                )}

                {/* DOCTORS */}

                {/* DOCTORS */}
                {activeTab === "doctors" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Our Doctors</h3>

                    {/* Loading */}
                    {doctorLoading && (
                      <p className="text-center text-gray-500">
                        Loading doctors...
                      </p>
                    )}

                    {/* Empty */}
                    {!doctorLoading && doctors.length === 0 && (
                      <p className="text-center text-gray-500">
                        No doctors available
                      </p>
                    )}

                    {/* List */}
                    <div className="space-y-6">
                      {doctors.map((doc) => (
                        <div
                          key={doc._id}
                          className="flex items-start gap-4 border-b pb-6"
                        >
                          {/* Image */}
                          <img
                            src={doc?.imageUrl?.[0]}
                            alt="Doctor"
                            className="w-24 h-24 rounded-lg object-cover border"
                          />

                          {/* Info */}
                          <div className="flex-1">
                            <h4 className="text-lg font-bold mb-1">
                              {doc?.name}
                            </h4>

                            <p className="text-sm text-gray-600 mb-2">
                              {doc?.qualificationAndExperience}
                            </p>

                            <p className="text-sm text-blue-600 mb-3">
                              Working Since: {doc?.workingFrom}
                            </p>

                            <button className="px-4 py-1.5 border border-blue-600 text-blue-600 rounded-md text-sm hover:bg-blue-50">
                              View Profile
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STORIES */}
                {activeTab === "stories" && (
                  <div className="text-center text-gray-500 py-12">
                    Stories Coming Soon 📖
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalProfile;
