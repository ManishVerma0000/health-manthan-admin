import api from "@/api/api";

export const getHospitalList = async () => {
  const res = await api.get("/hospital/list");
  return res.data;
};

export interface CreateHospitalPayload {
  hospitalName: string;
  hospitalType: string;
  contactNumber: string;
  whatsapp: string;
  email: string;
  city: string;
  mapDirection: string;
  location: string;

  iconUrl: string;
  imageUrls: string[];
  timings: any[];

  treatmentList: string[];
  cashlessList: string[];
  panelList: string[];
}

export const createHospitalApi = async (payload: any) => {
  const response = await api.post("/hospital", payload);
  return response.data;
};

export const createHospitalCategoryApi = async (hospitalCategory: string) => {
  const res = await api.post("/hospital-category", {
    hospitalCategory,
  });
  return res.data;
};

// GET: list hospital categories
export const fetchHospitalCategoriesApi = async () => {
  const res = await api.get("/hospital-category/list");
  return res.data;
};

// DELETE: hospital category by id
export const deleteHospitalApi = (id: string) => {
  return api.delete(`/hospital/${id}`);
};

export const deleteHospitalCategoryApi = (id: string) => {
  return api.delete(`/hospital-category/${id}`);
};

export const getHospitalById = async (id: string) => {
  const res = await api.get(`/hospital/${id}`);
  return res.data;
};
