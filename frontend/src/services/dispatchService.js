import axiosInstance from "../api/axiosInstance";

// Fetch all dispatches
export const getDispatches = async () => {

    const token = localStorage.getItem("token");

    const response = await axiosInstance.get("/dispatch", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

// Fetch single dispatch
export const getDispatchById = async (id) => {

    const token = localStorage.getItem("token");

    const response = await axiosInstance.get(`/dispatch/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

// Create new dispatch
export const createDispatch = async (dispatchData) => {

    const token = localStorage.getItem("token");

    const response = await axiosInstance.post(
        "/dispatch",
        dispatchData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

// Delete dispatch
export const deleteDispatch = async (id) => {

    const token = localStorage.getItem("token");

    const response = await axiosInstance.delete(`/dispatch/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};