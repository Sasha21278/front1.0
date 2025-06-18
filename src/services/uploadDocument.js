import api  from "./api.js";

export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    const response = await api.post("/files/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};
