// Import configured axios instance
import axiosInstance from "../api/axiosInstance";

// Get JWT token from local storage
const getToken = () => localStorage.getItem("token");

// Create authorization header
const getConfig = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

// Get all sales executives
export const getExecutives = async () => {
    const response = await axiosInstance.get(
        "/salesexecutives",
        getConfig()
    );

    return response.data;
};

// Get single sales executive
export const getExecutiveById = async (id) => {
    const response = await axiosInstance.get(
        `/salesexecutives/${id}`,
        getConfig()
    );

    return response.data;
};

// Add new sales executive
export const addExecutive = async (executiveData) => {
    const response = await axiosInstance.post(
        "/salesexecutives",
        executiveData,
        getConfig()
    );

    return response.data;
};

// Update sales executive
export const updateExecutive = async (id, executiveData) => {
    const response = await axiosInstance.put(
        `/salesexecutives/${id}`,
        executiveData,
        getConfig()
    );

    return response.data;
};

// Delete sales executive
export const deleteExecutive = async (id) => {
    const response = await axiosInstance.delete(
        `/salesexecutives/${id}`,
        getConfig()
    );

    return response.data;
};