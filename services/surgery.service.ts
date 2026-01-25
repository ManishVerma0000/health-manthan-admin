import api from "@/api/api";

export const createSurgeryApi = async (payload: any) => {
  const response = await api.post("/surgery", payload);
  return response.data;
};


export const getSurgeryListApi = async () => {
  const res = await api.get(`/surgery/list`);
  return res.data;
};


export const deleteSurgeryApi = (id: string) => {
  return api.delete(`/surgery/${id}`);
};