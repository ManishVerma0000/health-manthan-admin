"use client"
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Star } from 'lucide-react';
import Header from '@/components/Header';

interface TabType {
  id: string;
  label: string;
  count?: number;
}

interface DoctorType {
  id: number;
  name: string;
  degrees: string;
  specialization: string;
  experience: number;
  image: string;
}

const HospitalProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('doctors');

  const tabs: TabType[] = [
    { id: 'treatment', label: 'Treatment Provider' },
    { id: 'doctors', label: 'Doctors', count: 6 },
    { id: 'cashless', label: 'Cashless', count: 10 },
    { id: 'government', label: 'Government', count: 2 },
    { id: 'stories', label: 'Stories', count: 20 },
  ];

  const doctors: DoctorType[] = [
    {
      id: 1,
      name: 'Dinesh Saini',
      degrees: 'MBBS, DGO, DNB',
      specialization: 'Obstetrics & Gynecology, Fellowship in Reproductive Medicine Infertility Specialist, Gynecologist, Obstetrician, Laparoscopic Surgeon (Obs & Gyn)',
      experience: 21,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop'
    },
    {
      id: 2,
      name: 'Dinesh Saini',
      degrees: 'MBBS, DGO, DNB',
      specialization: 'Obstetrics & Gynecology, Fellowship in Reproductive Medicine Infertility Specialist, Gynecologist, Obstetrician, Laparoscopic Surgeon (Obs & Gyn)',
      experience: 21,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop'
    },
    {
      id: 3,
      name: 'Dinesh Saini',
      degrees: 'MBBS, DGO, DNB',
      specialization: 'Obstetrics & Gynecology, Fellowship in Reproductive Medicine Infertility Specialist, Gynecologist, Obstetrician, Laparoscopic Surgeon (Obs & Gyn)',
      experience: 21,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        <Header/>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Hospital Profile</h1>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Edit Hospital
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Hospital Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg  shadow-sm p-6">
              {/* Doctor Image */}
              <div className="flex items-start mb-4">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop"
                  alt="Doctor"
                  className="w-20 h-20 rounded-lg object-cover mr-4"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Health Manthan</h2>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-gray-900">220</span>
                    <span className="ml-1 text-sm text-gray-500">ratings</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start mb-4">
                <MapPin className="w-4 h-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  2, Thiruvallur Layout, 3/4 Stage, 2 nd Block, Landmark, Opposite to Central Bank, Basavanagudi
                </p>
              </div>

              {/* Direction Button */}
              <button className="w-full mb-6 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center text-sm font-medium">
                <MapPin className="w-4 h-4 mr-2" />
                Direction
              </button>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-900 font-medium">7969969655</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-900 font-medium">7969969655</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-900 font-medium">dinesh@jbs@gmail.com</span>
                </div>
              </div>

              {/* Timing */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Timing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mon - Fri</span>
                    <div className="flex gap-4">
                      <span className="text-gray-900">9:00 AM - 6:00 PM</span>
                      <span className="text-gray-900">6:30 AM - 8:00 PM</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sat</span>
                    <div className="flex gap-4">
                      <span className="text-gray-900">9:00 AM - 5:00 PM</span>
                      <span className="text-gray-900">6:30 AM - 8:00 PM</span>
                    </div>
                  </div>
                </div>
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
                        px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                        ${
                          activeTab === tab.id
                            ? 'border-blue-600 text-white bg-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="ml-1">({tab.count})</span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Doctors List */}
              <div className="p-6">
                {activeTab === 'doctors' && (
                  <div className="space-y-6">
                    {doctors.map((doctor) => (
                      <div key={doctor.id} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{doctor.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {doctor.degrees} - {doctor.specialization}
                          </p>
                          <p className="text-sm text-blue-600 font-medium mb-3">
                            {doctor.experience} Years of Experience
                          </p>
                          <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium">
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab !== 'doctors' && (
                  <div className="text-center text-gray-500 py-12">
                    Content for {tabs.find(t => t.id === activeTab)?.label} tab
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