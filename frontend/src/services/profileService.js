import api from "../api/axiosInstance";

// Get profile
export const getProfile = async (token) => {

    const response = await api.get(
        "/profile",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;

};

// Change password
export const changePassword = async (
    passwordData,
    token
) => {

    const response = await api.put(
        "/profile/password",
        passwordData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;

};