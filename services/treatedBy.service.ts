import api from "@/api/api";

/* Get List */
export const getTreatedByListApi = async () => {
  const response: any = await api.get("/treated-by/list");
  return response.data;
};

/* Create */
export const createTreatedByApi = async (data: {
  treatedByName: string;
}) => {
  const response: any = await api.post("/treated-by", data);
  return response.data;
};

/* Delete */
export const deleteTreatedByApi = async (id: string) => {
  const response: any = await api.delete(`/treated-by/${id}`);
  return response.data;
};
