"use client";

import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Star } from "lucide-react";
import { useParams } from "next/navigation";

import Header from "@/components/Header";
import { getHospitalById } from "@/services/hospital.service";

interface TabType {
  id: string;
  label: string;
  count?: number;
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
}

const HospitalProfile: React.FC = () => {

  const [activeTab, setActiveTab] = useState("doctors");
  const [hospital, setHospital] = useState<HospitalData | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params?.id as string;

  const tabs: TabType[] = [
    { id: "treatment", label: "Treatment Provider" },
    { id: "doctors", label: "Doctors", count: 6 },
    { id: "cashless", label: "Cashless", count: 10 },
    { id: "government", label: "Government", count: 2 },
    { id: "stories", label: "Stories", count: 20 },
  ];

  // ✅ Fetch Hospital
  useEffect(() => {
    if (!id) return;

    const fetchHospital = async () => {
      try {
        const res = await getHospitalById(id);

        setHospital(res.data);

      } catch (err) {
        console.error("Hospital API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  // Loader
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  // No Data
  if (!hospital) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        No Hospital Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <h1 className="text-xl font-semibold">
            {hospital.hospitalName}
          </h1>

          <button className="text-blue-600 text-sm font-medium">
            Edit Hospital
          </button>

        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-1">

            <div className="bg-white shadow-sm rounded-lg p-6">

              {/* Image */}
              <div className="flex items-start mb-4">

                <img
                  src={hospital.iconUrl}
                  alt={hospital.hospitalName}
                  className="w-20 h-20 rounded-lg object-cover mr-4"
                />

                <div className="flex-1">

                  <h2 className="text-xl font-bold mb-2">
                    {hospital.hospitalName}
                  </h2>

                  <div className="flex items-center mb-2">

                    {[1,2,3,4,5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}

                    <span className="ml-2 text-sm font-semibold">
                      220
                    </span>

                    <span className="ml-1 text-sm text-gray-500">
                      ratings
                    </span>

                  </div>

                </div>

              </div>

              {/* Address */}
              <div className="flex items-start mb-4">

                <MapPin className="w-4 h-4 mt-1 mr-2 text-gray-500" />

                <p className="text-sm text-gray-600">
                  {hospital.location}, {hospital.city}
                </p>

              </div>

              {/* Direction */}
              <a
                href={hospital.mapDirection}
                target="_blank"
                className="w-full mb-6 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex justify-center text-sm font-medium"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Direction
              </a>

              {/* Contact */}
              <div className="space-y-3 mb-6">

                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">
                    {hospital.contactNumber}
                  </span>
                </div>

                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">
                    {hospital.whatsapp}
                  </span>
                </div>

                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">
                    {hospital.email}
                  </span>
                </div>

              </div>

              {/* Timing */}
              <div className="border-t pt-4">

                <h3 className="text-sm font-bold mb-3">
                  Timing
                </h3>

                <div className="space-y-2">

                  {hospital.timings.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {item.days}
                      </span>

                      <span className="text-gray-900">
                        {item.time}
                      </span>
                    </div>
                  ))}

                </div>

              </div>

            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-lg shadow-sm">

              {/* Tabs */}
              <div className="border-b">

                <nav className="flex -mb-px">

                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium whitespace-nowrap
                        ${
                          activeTab === tab.id
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      {tab.label}

                      {tab.count && (
                        <span className="ml-1">
                          ({tab.count})
                        </span>
                      )}

                    </button>
                  ))}

                </nav>

              </div>

              {/* Content */}
              <div className="p-6">

                {activeTab === "doctors" && (
                  <div className="text-center text-gray-500 py-12">
                    Doctors API Coming Soon 😄
                  </div>
                )}

                {activeTab !== "doctors" && (
                  <div className="text-center text-gray-500 py-12">
                    Content for {activeTab} tab
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
