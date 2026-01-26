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
  iconUrl?: string;

  // STEP 1 - First component images
  firstStepImageUrls: string[];

  // STEP 2 (IDs ONLY)
  treatmentList: string[];
  cashlessList: string[];
  panelList: string[];
  imageUrls: string[];
  hospitaldetails: string;
};
