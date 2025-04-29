import axios from "./api";

export const getCurrentUser = async () => {
    const res = await axios.get("/auth/me");
    return res.data;
};
