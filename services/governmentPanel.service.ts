import api from "@/api/api";

// CREATE PANEL
export const createGovernmentPanelApi = async (payload: {
  panelName: string;
}) => {
  const response = await api.post("/goverment-panel", payload);
  return response?.data;
};


export const getGovernmentPanelListApi = async () => {
  const response = await api.get("/goverment-panel/list");
  return response?.data;
};

// DELETE PANEL
export const deleteGovernmentPanelApi = async (id: string) => {
  const response = await api.delete(`/goverment-panel/${id}`);
  return response?.data;
};

export const updateGovernmentPanelApi = async (
  id: string,
  payload: {
    panelName: string;
  }
) => {
  const response = await api.put(`/goverment-panel/${id}`, payload);
  return response?.data;
};