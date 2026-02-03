import api from "@/api/api";

export const getContactListApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await api.get("/contact-us/list", {
    params,
  });
  return response?.data;
};
