import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

// автоматически добавлять токен
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// логика на 401
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// API методы
export const login = (data) => instance.post("/auth/login", data);
export const register = (data) => instance.post("/auth/register", data);
export const logout = () => instance.post("/auth/logout");

export const uploadDocument = (formData) =>
    instance.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const getDocuments = () => instance.get("/auth/my-documents");
export const deleteDocument = (id) => instance.delete(`/document/${id}`);
export const updateDocument = (id, data) =>
    instance.put(`/document/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const extractMetadata = (file, title) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    return instance.post("/test/extract-metadata", formData);
};

export const getMetadata = (id) => instance.get(`/document/${id}/metadata`);
export const getProfile = () => instance.get("/auth/profile");

export default instance; // ✅ обязательно
