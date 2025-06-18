import { api } from "./api.js";

export const getCurrentUser = async () => {
    const res = await api.get("/users/me");
    return res.data;
};
