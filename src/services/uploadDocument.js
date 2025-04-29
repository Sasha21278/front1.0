import api  from "./api";

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
