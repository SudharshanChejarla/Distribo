import api from "../api/axiosInstance";

export const getDispatchProducts = async (
    dispatchDate,
    salesExecutive,
    token
) => {

    const response = await api.get("/returns/dispatch-products", {
        params: {
            dispatchDate,
            salesExecutive
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

// Save return entry
export const saveReturnEntry = async (returnData, token) => {

    const response = await api.post(
        "/returns",
        returnData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;

};