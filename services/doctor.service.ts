import api from "@/api/api";

export const getDoctorList = async () => {
  const res = await api.get(`/doctor/list`);
  return res?.data;
};

export const createDoctorApi = async (payload: any) => {
  const response = await api.post("/doctor", payload);
  return response?.data;
};

export const updateDoctorApi = async (id: string, payload: any) => {
  const response = await api.put(`/doctor/${id}`, payload);
  return response?.data;
};

export const deleteDoctorApi = (id: string) => {
  return api.delete(`/doctor/${id}`);
};

export const getDoctorById = async (id: string) => {
  const res = await api.get(`/doctor/${id}`);
  return res?.data;
};


export const getDoctorsByHospital = async (hospitalId: string) => {
  const res = await api.get(`/doctor/hospital/${hospitalId}`);
  return res?.data;
};