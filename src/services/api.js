import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    // baseURL: "http://195.113.104.72:8080/api",
    withCredentials: true,
});
export const downloadFile = async (id) => {
    return instance.get(`/files/download/${id}`, {
        responseType: "blob",
    });
};
export const searchDocuments = (params) =>
    instance.get("/document/search", { params });


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

export const uploadDocument = (formData, onProgress) =>
    instance.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            if (onProgress) onProgress(percent);
        },
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
export const getAllUsers = () => instance.get("/admin/users");
export const updateUserRole = (id, role) => instance.put(`/admin/users/${id}/role?role=${role}`);
export const deleteUser = (id) => instance.delete(`/admin/users/${id}`);
export const getAllDocuments = () => instance.get("/admin/documents");
export const deleteDocumentAdmin = (id) => instance.delete(`/admin/docs/${id}`);
export const getAdminStats = () => instance.get("/admin/stats");
export const getUserDocuments = (id) => instance.get(`/users/${id}/docs`);
export const updateProfile = (id, data) =>
    instance.put(`/auth/users/${id}`, data);

export const changePassword = (id, passwords) =>
    instance.put(`/auth/users/${id}/change-password`, passwords);

