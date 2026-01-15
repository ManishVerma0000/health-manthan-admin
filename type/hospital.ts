export type HospitalFormData = {
  hospitalName: string;
  hospitalType: string;
  contactNumber: string;
  whatsapp: string;
  email: string;
  city: string;
  mapDirection: string;
  location: string;
  icon: File | null;
  images: File[];
  timings: {
    days: string;
    time: string;
  }[];

  // STEP 2 (IDs ONLY)
  treatmentList: string[];
  cashlessList: string[];
  panelList: string[];
  imageUrls: string[];
};
