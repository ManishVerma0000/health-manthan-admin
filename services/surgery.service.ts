import api from "@/api/api";

export const createSurgeryApi = async (payload: any) => {
  const response = await api.post("/surgery", payload);
  return response?.data;
};

export const getSurgeryListApi = async () => {
  const res = await api.get(`/surgery/list`);
  return res?.data;
};

export const deleteSurgeryApi = (id: string) => {
  return api.delete(`/surgery/${id}`);
};

export const getSurgeryById = async (id: string) => {
  try {
    const response = await api.get(`/surgery/${id}`);
    return response?.data;
  } catch (error: any) {
    console.error("Get Surgery Error:", error);
    throw error;
  }
};
