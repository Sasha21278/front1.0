import React, { useState } from "react";
import axios from "axios";

const DocumentUpload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !title) {
            alert("Пожалуйста, выберите файл и введите название.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description.trim() === "" ? "Описание отсутствует" : description);

        try {
            await axios.post("http://localhost:8080/api/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`, // добавим токен если есть
                },
            });

            alert("Файл успешно загружен!");
            setFile(null);
            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Ошибка загрузки:", error);
            alert("Ошибка при загрузке файла.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Загрузка документа</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-medium mb-1">Название</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-1">Описание (необязательно)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        rows={3}
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-1">Файл</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Загрузить
                </button>
            </form>
        </div>
    );
};

export default DocumentUpload;
