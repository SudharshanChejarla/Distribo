import axiosInstance from "../api/axiosInstance";

// Add Product
export const addProduct = async (productData, token) => {
    const response = await axiosInstance.post(
        "/products",
        productData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

