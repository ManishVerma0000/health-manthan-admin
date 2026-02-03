// import api from "@/lib/api";

import api from "@/api/api";

export const loginApi = async (payload: {
  username: string;
  password: string;
}) => {
  const response:any = await api.post("/admin/login", payload);
  return response?.data;
};
