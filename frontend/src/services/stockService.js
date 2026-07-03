import axiosInstance from "../api/axiosInstance";
import { getToken } from "../utils/localStorage";

// Get products
export const getProducts = async () => {

    const token = getToken();

    const response = await axiosInstance.get("/stock/products", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

// Add stock
export const addStock = async (stockData) => {

    const token = getToken();

    const response = await axiosInstance.post("/stock", stockData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};