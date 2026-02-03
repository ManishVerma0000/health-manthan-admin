import api from "@/api/api";

export const uploadImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post(
    "/upload-images/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response?.data;
};
