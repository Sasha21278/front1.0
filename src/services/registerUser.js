import api from "./api.js";

export const registerUser = async (username, email, password) => {
    const response = await api.post("/auth/register", {
        username,
        email,
        password,
    });
    return response.data;
};
