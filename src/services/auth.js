import api from "./api.js"; // ← подключаем наш кастомный Axios instance

export const login = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    localStorage.setItem("token", res.data.accessToken); // сохраняем токен
    return res.data;
};

export const register = async (user) => {
    const res = await api.post("/auth/register", user);
    return res.data;
};

export const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
};
export const setUserToLocalStorage = (user) => {
    localStorage.setItem("token", user.accessToken);
    localStorage.setItem("user", JSON.stringify(user));
};

export const getUserFromLocalStorage = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
