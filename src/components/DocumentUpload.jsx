import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { uploadDocument } from "../services/api";
import toast from "react-hot-toast";

const DocumentUpload = () => {
    const { t } = useTranslation();
    const fileInputRef = useRef();

    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [generateSummary, setGenerateSummary] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error(t("upload_error_required"));
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title.trim() || file.name);
        formData.append("generateSummary", generateSummary.toString());

        try {
            await uploadDocument(formData, setProgress);
            toast.success(t("upload_success"));

            // Очистка
            setFile(null);
            setTitle("");
            setGenerateSummary(false);
            setProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            toast.error(t("upload_fail"));
            setProgress(0);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t("uploadDocumentTitle")}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">{t("documentTitle")}</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded w-full"
                        placeholder={t("optional")}
                    />
                </div>

                <div>
                    <label className="block font-medium">{t("selectFile")}</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>

                <div className="flex items-start space-x-2">
                    <input
                        type="checkbox"
                        id="generateSummary"
                        checked={generateSummary}
                        onChange={() => setGenerateSummary(!generateSummary)}
                        className="mt-1"
                    />
                    <label htmlFor="generateSummary" className="text-sm">
                        {t("generateSummaryLabel") || "🧪 Сгенерировать краткое описание (медленно, бета)"}
                    </label>
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

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {t("upload")}
                </button>
            </form>
        </div>
    );
};

export default DocumentUpload;
