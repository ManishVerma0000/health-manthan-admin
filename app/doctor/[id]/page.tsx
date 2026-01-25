"use client";
import React, { useState } from "react";
import { X, Phone, MessageCircle } from "lucide-react";
import Header from "@/components/Header";

interface DoctorDetailsProps {
  onClose?: () => void;
}

const DoctorDetails: React.FC<DoctorDetailsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "treatments" | "stories"
  >("treatments");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const treatments = [
    "Eye Surgery",
    "Eye Surgery",
    "Eye Surgery",
    "Eye Surgery",
    "Eye Surgery",
    "Eye Surgery",
    "Eye Surgery",
  ];

  return (
    <div className="fixed inset-0  flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)]">
          {/* Doctor Info Section */}
          <div className="p-6 border-b">
            <div className="flex gap-6">
              {/* Doctor Image */}
              <div className="flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop"
                  alt="Dr. Dinesh Saini"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              </div>

              {/* Doctor Details */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Dinesh Saini
                </h3>

                {/* Contact Info */}
                <div className="flex gap-4 mb-3">
                  <a
                    href="tel:7959959955"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Phone size={18} />
                    <span className="text-sm font-medium">7959959955</span>
                  </a>
                  <a
                    href="https://wa.me/7959959955"
                    className="flex items-center gap-2 text-green-600 hover:text-green-700"
                  >
                    <MessageCircle size={18} />
                    <span className="text-sm font-medium">7959959955</span>
                  </a>
                </div>

                {/* Qualifications */}
                <p className="text-sm text-gray-700 mb-2">
                  MBBS, DGO, DNB - Obstetrics & Gynecology, Fellowship in
                  Reproductive Medicine Infertility Specialist, Gynecologist,
                  Obstetrician, Laparoscopic Surgeon (Obs & Gyn)
                </p>

                {/* Experience */}
                <p className="text-blue-600 font-semibold text-sm mb-3">
                  21 Years of Experience
                </p>

                {/* About Section */}
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    About Dinesh Saini :{" "}
                  </span>
                  <span>
                    MBBS, DGO, DNB - Obstetrics & Gynecology, Fellowship in
                    Reproductive Medicine Infertility Specialist, Gynecologist,
                    Obstetrician, Laparoscopic Surgeon (Obs & Gyn) Specialist,
                    Gynecologist, Obstetrician, Laparoscopic Surgeon (Obs & Gyn)
                    Specialist, Gynecologist, Obstetrician, Laparoscopic Surgeon{" "}
                    {!showFullDescription && (
                      <button
                        onClick={() => setShowFullDescription(true)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Read More
                      </button>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "overview"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("treatments")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "treatments"
                    ? "text-white bg-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Treatments
              </button>
              <button
                onClick={() => setActiveTab("stories")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "stories"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Stories
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "treatments" && (
              <div className="flex flex-wrap gap-3">
                {treatments.map((treatment, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300 hover:bg-gray-200 transition-colors"
                  >
                    {treatment}
                  </span>
                ))}
              </div>
            )}

            {activeTab === "overview" && (
              <div className="text-gray-600">
                <p>Overview content would go here...</p>
              </div>
            )}

            {activeTab === "stories" && (
              <div className="text-gray-600">
                <p>Stories content would go here...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo wrapper to show the modal
export default function App() {
  // const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Header />
      <DoctorDetails />
    </div>
  );
}
