"use client";
import React, { useState } from "react";
import { ChevronLeft, Plus, X, ImageIcon } from "lucide-react";
import { uploadImageApi } from "@/services/upload.services";

const extractImageUrl = (res: any): string => {
  return res?.file?.url || "";
};

// Types
interface SurgeryDetails {
  surgeryName: string;
  diseaseNeme: string;
  recoveryTime: string;
  icon: string | null;
  uploadIcon: string;
  surgeryCategory: string;
  duration: string;
  treatedBy: string;
  costingRange: string;
}

interface Symptom {
  subcategory: string;
  paragraph: string;
}

interface ProcedureStep {
  step: string;
  typeProcedure: string;
  duration: string;
  medication: string;
}

interface RecoveryStep {
  stage: string;
  mention: string;
  lightCare: string;
}

interface SurgeryInformation {
  symptoms: Symptom[];
  images: string[]; // uploaded image URLs
  procedureTimeline: ProcedureStep[];
  benefits: string[];
  risks: string[];
  recoveryTimeline: RecoveryStep[];
  faqs: { question: string; answer: string }[];
}

// Step 1: Surgery Details Component
const SurgeryDetailsStep: React.FC<{
  data: SurgeryDetails;
  onChange: (data: SurgeryDetails) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onChange, onNext, onBack }) => {
  const handleInputChange = (field: keyof SurgeryDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      const res = await uploadImageApi(file);
      const imageUrl = extractImageUrl(res);

      if (!imageUrl) return;

      setImageFile(file);
      onChange({ ...data, icon: imageUrl });
    } catch (err) {
      console.error("Icon upload failed", err);
    }
  };

  const handleBrowse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      const res = await uploadImageApi(e.target.files[0]);
      const imageUrl = extractImageUrl(res);

      if (!imageUrl) return;

      setImageFile(e.target.files[0]);
      onChange({ ...data, icon: imageUrl });
    } catch (err) {
      console.error("Icon upload failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 ">
          <h1 className="text-xl font-semibold">Add New Surgery</h1>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={20} />
              Back to Listing
            </button>
            <button
              onClick={onNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save & Next
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-semibold">
              1
            </div>
            <span className="text-yellow-600 font-medium">Surgery Details</span>
          </div>
          <div className="w-24 h-0.5 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
              2
            </div>
            <span className="text-gray-400">Surgery Information</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Form Fields */}
            <div className="col-span-2 space-y-6">
              <h2 className="text-lg font-semibold mb-4">Surgery Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surgery Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.surgeryName}
                    onChange={(e) =>
                      handleInputChange("surgeryName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surgery Category<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data.surgeryCategory}
                    onChange={(e) =>
                      handleInputChange("surgeryCategory", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Cardiac">Cardiac</option>
                    <option value="Neurological">Neurological</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disease Name
                  </label>
                  <input
                    type="text"
                    value={data.diseaseNeme}
                    onChange={(e) =>
                      handleInputChange("diseaseNeme", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.duration}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recovery Time<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.recoveryTime}
                    onChange={(e) =>
                      handleInputChange("recoveryTime", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treated By
                  </label>
                  <select
                    value={data.treatedBy}
                    onChange={(e) =>
                      handleInputChange("treatedBy", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select</option>
                    <option value="General Surgeon">General Surgeon</option>
                    <option value="Specialist">Specialist</option>
                  </select>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Costing</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costing Range<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.costingRange}
                    onChange={(e) =>
                      handleInputChange("costingRange", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="col-span-1">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center"
              >
                <ImageIcon size={50} className="text-gray-400 mb-3" />
                <p>Drag Image or</p>

                <label className="text-orange-600 underline cursor-pointer">
                  Browse
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleBrowse}
                  />
                </label>
              </div>

              {imageFile && (
                <p className="text-sm mt-2 text-gray-600">{imageFile.name}</p>
              )}

              {data.icon && (
                <p className="text-green-600 text-xs mt-2 break-all">
                  Uploaded URL: {data.icon}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 2: Surgery Information Component
const SurgeryInformationStep: React.FC<{
  surgeryDetails: SurgeryDetails;
  data: SurgeryInformation;
  onChange: (data: SurgeryInformation) => void;
  onBack: () => void;
  onSubmit: () => void;
}> = ({ surgeryDetails, data, onChange, onBack, onSubmit }) => {
  const addSymptom = () => {
    onChange({
      ...data,
      symptoms: [...data.symptoms, { subcategory: "", paragraph: "" }],
    });
  };

  const removeSymptom = (index: number) => {
    onChange({
      ...data,
      symptoms: data.symptoms.filter((_, i) => i !== index),
    });
  };

  const updateSymptom = (
    index: number,
    field: keyof Symptom,
    value: string
  ) => {
    const updated = [...data.symptoms];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, symptoms: updated });
  };

  const addProcedureStep = () => {
    onChange({
      ...data,
      procedureTimeline: [
        ...data.procedureTimeline,
        { step: "", typeProcedure: "", duration: "", medication: "" },
      ],
    });
  };

  const addBenefit = () => {
    onChange({
      ...data,
      benefits: [...data.benefits, ""],
    });
  };

  const addRisk = () => {
    onChange({
      ...data,
      risks: [...data.risks, ""],
    });
  };

  const addRecoveryStep = () => {
    onChange({
      ...data,
      recoveryTimeline: [
        ...data.recoveryTimeline,
        { stage: "", mention: "", lightCare: "" },
      ],
    });
  };

  const addFAQ = () => {
    onChange({
      ...data,
      faqs: [...data.faqs, { question: "", answer: "" }],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 ">
          <h1 className="text-xl font-semibold">Add New Surgery</h1>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={20} />
              Back to Listing
            </button>
            <button
              onClick={onSubmit}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save & Next
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 p-6 ">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
              ✓
            </div>
            <span className="text-gray-600 font-medium">Surgery Details</span>
          </div>
          <div className="w-24 h-0.5 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-semibold">
              2
            </div>
            <span className="text-yellow-600 font-medium">
              Surgery Information
            </span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-8">
          {/* Surgery Overview */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Surgery Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surgery Details<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={surgeryDetails.surgeryName}
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paragraph
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className=" rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Symptoms</h2>
            </div>

            {data.symptoms.map((symptom, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory Details<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={symptom.subcategory}
                    onChange={(e) =>
                      updateSymptom(index, "subcategory", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paragraph
                  </label>
                  <input
                    type="text"
                    value={symptom.paragraph}
                    onChange={(e) =>
                      updateSymptom(index, "paragraph", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {index > 0 && (
                    <button
                      onClick={() => removeSymptom(index)}
                      className="absolute -right-10 top-8 text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;

                  try {
                    const res = await uploadImageApi(e.target.files[0]);
                    const imageUrl = extractImageUrl(res);

                    if (!imageUrl) return;

                    onChange({
                      ...data,
                      images: [...data.images, imageUrl],
                    });
                  } catch (err) {
                    console.error("Image upload failed", err);
                  }
                }}
              />

              {/* Preview uploaded images */}
              <div className="flex gap-3 mt-3 flex-wrap">
                {data.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt="uploaded"
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <button
                      onClick={() =>
                        onChange({
                          ...data,
                          images: data.images.filter((_, i) => i !== index),
                        })
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Procedure Timeline */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Procedure Timeline</h2>
              <button
                onClick={addProcedureStep}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Add More
              </button>
            </div>

            <div className="space-y-4">
              {data.procedureTimeline.map((step, index) => (
                <div key={index} className="grid grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Type Procedure"
                    value={step.typeProcedure}
                    onChange={(e) => {
                      const updated = [...data.procedureTimeline];
                      updated[index].typeProcedure = e.target.value;
                      onChange({ ...data, procedureTimeline: updated });
                    }}
                    className="px-3 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Duration"
                    value={step.duration}
                    onChange={(e) => {
                      const updated = [...data.procedureTimeline];
                      updated[index].duration = e.target.value;
                      onChange({ ...data, procedureTimeline: updated });
                    }}
                    className="px-3 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Medication"
                    value={step.medication}
                    onChange={(e) => {
                      const updated = [...data.procedureTimeline];
                      updated[index].medication = e.target.value;
                      onChange({ ...data, procedureTimeline: updated });
                    }}
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Benefits</h2>
              <button
                onClick={addBenefit}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Add More
              </button>
            </div>

            <div className="space-y-2">
              {data.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Benefit"
                    value={benefit}
                    onChange={(e) => {
                      const updated = [...data.benefits];
                      updated[index] = e.target.value;
                      onChange({ ...data, benefits: updated });
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />

                  {index > 0 && (
                    <button
                      onClick={() =>
                        onChange({
                          ...data,
                          benefits: data.benefits.filter((_, i) => i !== index),
                        })
                      }
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Risks</h2>
              <button
                onClick={addRisk}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Add More
              </button>
            </div>

            <div className="space-y-2">
              {data.risks.map((risk, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Risk"
                    value={risk}
                    onChange={(e) => {
                      const updated = [...data.risks];
                      updated[index] = e.target.value;
                      onChange({ ...data, risks: updated });
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />

                  {index > 0 && (
                    <button
                      onClick={() =>
                        onChange({
                          ...data,
                          risks: data.risks.filter((_, i) => i !== index),
                        })
                      }
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Timeline */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recovery Timeline</h2>
              <button
                onClick={addRecoveryStep}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Add More
              </button>
            </div>

            <div className="space-y-4">
              {data.recoveryTimeline.map((step, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <input
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={step.stage}
                    onChange={(e) => {
                      const updated = [...data.recoveryTimeline];
                      updated[index].stage = e.target.value;
                      onChange({ ...data, recoveryTimeline: updated });
                    }}
                  />

                  <input
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={step.mention}
                    onChange={(e) => {
                      const updated = [...data.recoveryTimeline];
                      updated[index].mention = e.target.value;
                      onChange({ ...data, recoveryTimeline: updated });
                    }}
                  />

                  <input
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={step.lightCare}
                    onChange={(e) => {
                      const updated = [...data.recoveryTimeline];
                      updated[index].lightCare = e.target.value;
                      onChange({ ...data, recoveryTimeline: updated });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          {/* FAQ */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">FAQ</h2>
              <button
                onClick={addFAQ}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Add FAQ
              </button>
            </div>

            {/* FAQ Inputs */}
            {data.faqs.map((faq, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                <input
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => {
                    const updated = [...data.faqs];
                    updated[index].question = e.target.value;
                    onChange({ ...data, faqs: updated });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...data.faqs];
                    updated[index].answer = e.target.value;
                    onChange({ ...data, faqs: updated });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [surgeryDetails, setSurgeryDetails] = useState<SurgeryDetails>({
    surgeryName: "",
    diseaseNeme: "",
    recoveryTime: "",
    icon: null,
    uploadIcon: "",
    surgeryCategory: "",
    duration: "",
    treatedBy: "",
    costingRange: "",
  });

  const [surgeryInformation, setSurgeryInformation] =
    useState<SurgeryInformation>({
      symptoms: [{ subcategory: "", paragraph: "" }],
      images: [],
      procedureTimeline: [
        { step: "", typeProcedure: "", duration: "", medication: "" },
      ],
      benefits: [""],
      risks: [""],
      recoveryTimeline: [{ stage: "", mention: "", lightCare: "" }],
      faqs: [],
    });

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      // Handle navigation back to listing
      console.log("Back to listing");
    }
  };

  const handleSubmit = async () => {
    // Combine all data for API submission
    const fullData = {
      ...surgeryDetails,
      ...surgeryInformation,
    };

    console.log("Submitting data:", fullData);

    // API call would go here
    // try {
    //   const response = await fetch('/api/surgery', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(fullData)
    //   });
    //   const result = await response.json();
    //   console.log('Success:', result);
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  };

  return (
    <>
      {currentStep === 1 ? (
        <SurgeryDetailsStep
          data={surgeryDetails}
          onChange={setSurgeryDetails}
          onNext={handleNext}
          onBack={handleBack}
        />
      ) : (
        <SurgeryInformationStep
          surgeryDetails={surgeryDetails}
          data={surgeryInformation}
          onChange={setSurgeryInformation}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default App;
