import api from "@/api/api";

export const getCategoriesApi = async () => {
  const response: any = await api.get("/categories/list");
  return response.data;
};



/**
 * Upload single image (icon / category image)
 */
export const uploadImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response: any = await api.post(
    "/upload-images/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data; // { success, file: { url } }
};

/**
 * Create category
 */
export const createCategoryApi = async (payload: {
  categoryName: string;
  labelName: string;
  imageUrl: string;
  iconImage: string;
}) => {
  const response: any = await api.post("/categories", payload);
  return response.data;
};
