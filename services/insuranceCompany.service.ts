import api from "@/api/api";

// GET: list insurance companies
export const fetchInsuranceCompaniesApi = async () => {
  const res = await api.get("/insurance-company/list");
  return res?.data;
};


// DELETE insurance company
export const deleteInsuranceCompanyApi = async (id: string) => {
  const res = await api.delete(`/insurance-company/${id}`);
  return res?.data;
};


export const createInsuranceCompanyApi = async (
  insuranceCompany: string
) => {
  const res = await api.post("/insurance-company", {
    insuranceCompany,
  });
  return res?.data;
};