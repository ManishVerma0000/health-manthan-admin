import api from "@/api/api";

export const createCashlessInsuranceApi = async (payload: {
  cashlessInsuranceCompany: string;
}) => {
  const response = await api.post(
    "/cashless-insurance-company",
    payload
  );
  return response?.data;
};


export const getCashlessInsuranceListApi = async () => {
  const response = await api.get("/cashless-insurance-company/list");
  return response?.data;
};

// DELETE
export const deleteCashlessInsuranceApi = async (id: string) => {
  const response = await api.delete(`/cashless-insurance-company/${id}`);
  return response?.data;
};