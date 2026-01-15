import api from "@/api/api";

export const getBookAppointmentListApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await api.get("/book-appointment/list", {
    params,
  });
  return response.data;
};
