import React, { useState } from "react";
import { uploadDocument } from "../services/api";
import toast from "react-hot-toast";

const DocumentUpload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [progress, setProgress] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title) {
            toast.error("Укажите файл и название");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);

        try {
            await uploadDocument(formData, setProgress);
            toast.success("Файл успешно загружен");
            setFile(null);
            setTitle("");
            setProgress(0);
        } catch (error) {
            toast.error("Ошибка при загрузке файла");
            setProgress(0);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Загрузить документ</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Название документа</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Выберите файл</label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>

                {progress > 0 && (
                    <div className="w-full bg-gray-200 rounded h-4">
                        <div
                            className="bg-blue-500 h-4 rounded text-xs text-white text-center"
                            style={{ width: `${progress}%` }}
                        >
                            {progress}%
                        </div>
                    </div>
                )}

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Загрузить
                </button>
            </form>
        </div>
    );
};

export default DocumentUpload;
