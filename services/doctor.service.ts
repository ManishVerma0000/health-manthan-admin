import api from "@/api/api";
import axios from "axios";

const API_URL = "";

export const getDoctorList = async () => {
  const res = await api.get(`/doctor/list`);
  return res.data;
};

export const createDoctorApi = async (payload: any) => {
  const response = await api.post("/doctor", payload);
  return response.data;
};