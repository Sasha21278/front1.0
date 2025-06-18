import axios from "./api.js";

export const getCurrentUser = async () => {
    const res = await axios.get("/auth/me");
    return res.data;
};
