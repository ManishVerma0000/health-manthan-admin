import api from "@/api/api";

export const createSurgeryApi = async (payload: any) => {
  const response = await api.post("/surgery", payload);
  return response.data;
};
