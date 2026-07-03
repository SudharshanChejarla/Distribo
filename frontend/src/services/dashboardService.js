import axios from "../api/axiosInstance";


// Get dashboard data
export const getDashboardData = async (token) => {

    const response = await axios.get(
        "/dashboard",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;

};