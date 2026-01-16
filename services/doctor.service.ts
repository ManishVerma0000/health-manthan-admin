import api from "@/api/api";
import axios from "axios";

const API_URL = "http://localhost:3000";

export const getDoctorList = async () => {
  const res = await axios.get(`${API_URL}/doctor/list`);
  return res.data;
};

export const createDoctorApi = async (payload: any) => {
  const response = await api.post("/doctor", payload);
  return response.data;
};