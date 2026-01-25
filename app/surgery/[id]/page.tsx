"use client";

import Header from "@/components/Header";
import React, { useState } from "react";

interface TabType {
  id: string;
  label: string;
  count?: number;
}

const EyeSurgeryDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  const tabs: TabType[] = [
    { id: "overview", label: "Overview" },
    { id: "doctors", label: "Doctors", count: 20 },
    { id: "cashless", label: "Cashless", count: 10 },
    { id: "government", label: "Government", count: 2 },
    { id: "stories", label: "Stories", count: 20 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header/>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Eye Surgery Details
          </h1>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Edit Hospital
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Surgery Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Eye Laser Surgery
              </h2>
              <p className="text-sm text-gray-600 mb-6">Eye Surgery</p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-l-4 border-blue-600 pl-3">
                  <p className="text-xs text-gray-500 mb-1">Diseases Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    Homopethiya or motibind
                  </p>
                </div>
                <div className="border-l-4 border-blue-600 pl-3">
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="text-sm font-medium text-gray-900">
                    15 Min - 20 min
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-l-4 border-blue-600 pl-3">
                  <p className="text-xs text-gray-500 mb-1">Recovery Time</p>
                  <p className="text-sm font-medium text-gray-900">3-4 Week</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-3">
                  <p className="text-xs text-gray-500 mb-1">Treated By</p>
                  <p className="text-sm font-medium text-gray-900">
                    General Surgeon
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=250&fit=crop"
                  alt="Eye surgery procedure"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Tabs Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        px-6 py-4 text-sm font-medium border-b-2 transition-colors
                        ${
                          activeTab === tab.id
                            ? "border-blue-600 text-blue-600 bg-blue-50"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }
                      `}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="ml-2 text-xs">({tab.count})</span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === "overview" && (
                  <div className="text-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Overview
                    </h3>
                    <p className="mb-4">
                      Eye laser surgery is a modern medical procedure used to
                      correct vision problems and treat various eye conditions.
                      This minimally invasive procedure uses advanced laser
                      technology to reshape the cornea and improve vision.
                    </p>
                    <p className="mb-4">
                      The procedure is commonly used to treat conditions such as
                      myopia (nearsightedness), hyperopia (farsightedness), and
                      astigmatism. It's performed by experienced
                      ophthalmologists and typically takes 15-20 minutes per
                      eye.
                    </p>
                    <p>
                      Recovery time is generally 3-4 weeks, during which
                      patients should follow their doctor's instructions
                      carefully to ensure optimal healing and results.
                    </p>
                  </div>
                )}
                {activeTab !== "overview" && (
                  <div className="text-center text-gray-500 py-12">
                    Content for {tabs.find((t) => t.id === activeTab)?.label}{" "}
                    tab
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
