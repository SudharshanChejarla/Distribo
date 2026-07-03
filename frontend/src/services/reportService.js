import api from "../api/axiosInstance";

// Generate reports
export const getReports = async (startDate, endDate, token) => {

    const response = await api.get(
        "/reports",
        {
            params: {
                startDate,
                endDate
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;

};