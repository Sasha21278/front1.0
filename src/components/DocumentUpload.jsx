import React, { useState } from "react";
import axios from "../services/api";

const DocumentUpload = ({ onUploaded }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");

    const handleUpload = async () => {
        if (!file || !title) return alert("Заполни все поля");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);

        try {
            await axios.post("/files/upload", formData);
            alert("Файл загружен!");
            if (onUploaded) onUploaded();
        } catch (error) {
            console.error(error);
            alert("Ошибка при загрузке файла");
        }
    };

    return (
        <div>
            <h2>Загрузка документа</h2>
            <input type="text" placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} />
            <input type="file" onChange={e => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Загрузить</button>
        </div>
    );
};

export default DocumentUpload;
