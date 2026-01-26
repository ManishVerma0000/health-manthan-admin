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

  symptoms: {
    subcategory: string;
    paragraph: string;
  }[];

  procedureTimeline: {
    step: string;
    typeProcedure: string;
    duration: string;
    medication: string;
  }[];

  benefits: string[];
  risks: string[];

  faqs: {
    question: string;
    answer: string;
  }[];
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
    { id: "cashless", label: "Procedure Timeline", count: 10 },
    { id: "government", label: "Benefits / Risks", count: 2 },
    { id: "stories", label: "FAQ", count: 20 },
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
              <h2 className="text-2xl font-bold mb-2">{surgery.surgeryName}</h2>

              <p className="text-sm text-gray-600 mb-6">
                {surgery.diseaseNeme}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-l-4 border-blue-600 pl-3">
                  <p className="text-xs text-gray-500 mb-1">Diseases Name</p>
                  <p className="text-sm font-medium">{surgery.diseaseNeme}</p>
                </div>

                <div className="border-l-4 border-blue-600 pl-3">
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="text-sm font-medium">{surgery.duration}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-l-4 border-blue-600 pl-3">
                  <p className="text-xs text-gray-500 mb-1">Recovery Time</p>
                  <p className="text-sm font-medium">{surgery.recoveryTime}</p>
                </div>

                <div className="border-l-4 border-blue-600 pl-3">
                  <p className="text-xs text-gray-500 mb-1">Treated By</p>
                  <p className="text-sm font-medium">{surgery.treatedBy}</p>
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
                        <span className="ml-2 text-xs">({tab.count})</span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {/* ================= OVERVIEW ================= */}
                {activeTab === "overview" && (
                  <div className="text-gray-600 space-y-3">
                    <h3 className="text-lg font-semibold mb-4">Overview</h3>

                    <p>
                      <b>Disease:</b> {surgery.diseaseNeme}
                    </p>

                    <p>
                      <b>Duration:</b> {surgery.duration}
                    </p>

                    <p>
                      <b>Recovery Time:</b> {surgery.recoveryTime}
                    </p>

                    <p>
                      <b>Treated By:</b> {surgery.treatedBy}
                    </p>
                  </div>
                )}

                {/* ================= SYMPTOMS (DOCTORS TAB) ================= */}
                {activeTab === "doctors" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Symptoms</h3>

                    <div className="space-y-4">
                      {surgery.symptoms?.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-gray-50"
                        >
                          <h4 className="font-medium text-gray-800">
                            {item.subcategory}
                          </h4>

                          <p className="text-sm text-gray-600 mt-1">
                            {item.paragraph}
                          </p>
                        </div>
                      ))}

                      {(!surgery.symptoms || surgery.symptoms.length === 0) && (
                        <p className="text-gray-500">No symptoms available</p>
                      )}
                    </div>
                  </div>
                )}

                {/* ================= PROCEDURE (CASHLESS TAB) ================= */}
                {activeTab === "cashless" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Procedure Timeline
                    </h3>

                    <div className="space-y-4">
                      {surgery.procedureTimeline?.map((step, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <p className="font-medium text-gray-800">
                            {index + 1}. {step.step}
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            Type: {step.typeProcedure}
                          </p>

                          <p className="text-sm text-gray-600">
                            Duration: {step.duration}
                          </p>

                          <p className="text-sm text-gray-600">
                            Medication: {step.medication}
                          </p>
                        </div>
                      ))}

                      {(!surgery.procedureTimeline ||
                        surgery.procedureTimeline.length === 0) && (
                        <p className="text-gray-500">No procedure info</p>
                      )}
                    </div>
                  </div>
                )}

                {/* ================= BENEFITS + RISKS (GOVERNMENT TAB) ================= */}
                {activeTab === "government" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Benefits */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-green-600">
                        Benefits
                      </h3>

                      <ul className="list-disc pl-5 space-y-2">
                        {surgery.benefits?.map((b, index) => (
                          <li key={index} className="text-gray-600">
                            {b}
                          </li>
                        ))}

                        {(!surgery.benefits ||
                          surgery.benefits.length === 0) && (
                          <li className="text-gray-500">No benefits listed</li>
                        )}
                      </ul>
                    </div>

                    {/* Risks */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-red-600">
                        Risks
                      </h3>

                      <ul className="list-disc pl-5 space-y-2">
                        {surgery.risks?.map((r, index) => (
                          <li key={index} className="text-gray-600">
                            {r}
                          </li>
                        ))}

                        {(!surgery.risks || surgery.risks.length === 0) && (
                          <li className="text-gray-500">No risks listed</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* ================= FAQ (STORIES TAB) ================= */}
                {activeTab === "stories" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Frequently Asked Questions
                    </h3>

                    <div className="space-y-4">
                      {surgery.faqs?.map((faq, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-gray-50"
                        >
                          <p className="font-medium text-gray-800">
                            Q: {faq.question}
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            A: {faq.answer}
                          </p>
                        </div>
                      ))}

                      {(!surgery.faqs || surgery.faqs.length === 0) && (
                        <p className="text-gray-500">No FAQs available</p>
                      )}
                    </div>
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
