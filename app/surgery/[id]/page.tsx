"use client";

import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getSurgeryById } from "@/services/surgery.service";

interface TabType {
  id: string;
  label: string;
  count?: number;
}

interface SurgeryData {
  surgeryName: string;
  diseaseNeme: string;
  duration: string;
  recoveryTime: string;
  treatedBy: string;
  icon: string;
  images: string[];
}

const EyeSurgeryDetails: React.FC = () => {

  const [activeTab, setActiveTab] = useState("overview");
  const [surgery, setSurgery] = useState<SurgeryData | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params?.id as string;

  const tabs: TabType[] = [
    { id: "overview", label: "Overview" },
    { id: "doctors", label: "Doctors", count: 20 },
    { id: "cashless", label: "Cashless", count: 10 },
    { id: "government", label: "Government", count: 2 },
    { id: "stories", label: "Stories", count: 20 },
  ];

  // ✅ API Call
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getSurgeryById(id);

        setSurgery(res.data);

      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
  if (!surgery) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        No Data Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <Header />

      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <h1 className="text-xl font-semibold text-gray-900">
            {surgery.surgeryName}
          </h1>

          <button className="text-blue-600 font-medium text-sm">
            Edit Hospital
          </button>

        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-1">

            <div className="bg-white rounded-lg shadow-sm p-6">

              <h2 className="text-2xl font-bold mb-2">
                {surgery.surgeryName}
              </h2>

              <p className="text-sm text-gray-600 mb-6">
                {surgery.diseaseNeme}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">

                <div className="border-l-4 border-blue-600 pl-3">
                  <p className="text-xs text-gray-500 mb-1">
                    Diseases Name
                  </p>
                  <p className="text-sm font-medium">
                    {surgery.diseaseNeme}
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-3">
                  <p className="text-xs text-gray-500 mb-1">
                    Duration
                  </p>
                  <p className="text-sm font-medium">
                    {surgery.duration}
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">

                <div className="border-l-4 border-blue-600 pl-3">
                  <p className="text-xs text-gray-500 mb-1">
                    Recovery Time
                  </p>
                  <p className="text-sm font-medium">
                    {surgery.recoveryTime}
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-3">
                  <p className="text-xs text-gray-500 mb-1">
                    Treated By
                  </p>
                  <p className="text-sm font-medium">
                    {surgery.treatedBy}
                  </p>
                </div>

              </div>

              {/* Image */}
              <div className="rounded-lg overflow-hidden">

                <img
                  src={surgery.images?.[0] || surgery.icon}
                  alt={surgery.surgeryName}
                  className="w-full h-48 object-cover"
                />

              </div>

            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-lg shadow-sm">

              {/* Tabs */}
              <div className="border-b border-gray-200">

                <nav className="flex -mb-px">

                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium border-b-2
                        ${
                          activeTab === tab.id
                            ? "border-blue-600 text-blue-600 bg-blue-50"
                            : "border-transparent text-gray-500"
                        }`}
                    >
                      {tab.label}

                      {tab.count && (
                        <span className="ml-2 text-xs">
                          ({tab.count})
                        </span>
                      )}

                    </button>
                  ))}

                </nav>

              </div>

              {/* Content */}
              <div className="p-8">

                {activeTab === "overview" && (

                  <div className="text-gray-600">

                    <h3 className="text-lg font-semibold mb-4">
                      Overview
                    </h3>

                    <p className="mb-2">
                      Disease: {surgery.diseaseNeme}
                    </p>

                    <p className="mb-2">
                      Duration: {surgery.duration}
                    </p>

                    <p>
                      Recovery: {surgery.recoveryTime}
                    </p>

                  </div>

                )}

                {activeTab !== "overview" && (

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

export default EyeSurgeryDetails;
