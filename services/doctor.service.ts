import api from "@/api/api";

export const getDoctorList = async () => {
  const res = await api.get(`/doctor/list`);
  return res.data;
};

export const createDoctorApi = async (payload: any) => {
  const response = await api.post("/doctor", payload);
  return response.data;
};

export const deleteDoctorApi = (id: string) => {
  return api.delete(`/doctor/${id}`);
};