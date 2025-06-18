import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { uploadDocument } from "../services/api.js";
import toast from "react-hot-toast";

const FACULTIES_KEYS = [
    "faculty_nature",
    "faculty_philosophy",
    "faculty_education",
    "faculty_art",
    "faculty_medicine",
    "faculty_social"
];

const DocumentUpload = ({ onUploaded }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef();

    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [generateSummary, setGenerateSummary] = useState(false);
    const [writeSummaryManually, setWriteSummaryManually] = useState(false);
    const [summary, setSummary] = useState("");
    const [supervisor, setSupervisor] = useState("");
    const [faculty, setFaculty] = useState("");
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
        formData.append("supervisor", supervisor);
        formData.append("faculty", faculty);
        if (writeSummaryManually && summary.trim()) {
            formData.append("summary", summary.trim());
        }

        try {
            await uploadDocument(formData, setProgress);
            toast.success(t("upload_success"));

            // Очистка формы
            setFile(null);
            setTitle("");
            setGenerateSummary(false);
            setWriteSummaryManually(false);
            setSummary("");
            setSupervisor("");
            setFaculty("");
            setProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = "";

            // 🔄 Автообновление документов
            if (typeof onUploaded === "function") {
                onUploaded();
            }

        } catch (error) {
            toast.error(t("upload_fail"));
            setProgress(0);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto text-gray-900 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">{t("uploadDocumentTitle")}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">{t("documentTitle")}</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-800 dark:text-white"
                        placeholder={t("optional")}
                    />
                </div>

                <div>
                    <label className="block font-medium">{t("supervisorLabel")}</label>
                    <input
                        type="text"
                        value={supervisor}
                        onChange={(e) => setSupervisor(e.target.value)}
                        className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-800 dark:text-white"
                        placeholder={t("supervisorPlaceholder")}
                    />
                </div>

                <div>
                    <label className="block font-medium">{t("facultyLabel")}</label>
                    <select
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-800 dark:text-white"
                        required
                    >
                        <option value="">{t("selectFaculty")}</option>
                        {FACULTIES_KEYS.map((key) => (
                            <option key={key} value={key}>{t(key)}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-medium">{t("selectFile")}</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-800 dark:text-white"
                        required
                    />
                </div>

                <div className="flex items-start space-x-2">
                    <input
                        type="checkbox"
                        id="generateSummary"
                        checked={generateSummary}
                        onChange={() => {
                            setGenerateSummary(!generateSummary);
                            if (!generateSummary) setWriteSummaryManually(false);
                        }}
                        className="mt-1"
                    />
                    <label htmlFor="generateSummary" className="text-sm">
                        {t("generateSummaryLabel")}
                    </label>
                </div>

                {!generateSummary && (
                    <>
                        <div className="flex flex-col space-y-4">
                            <button
                                type="button"
                                onClick={() => setWriteSummaryManually(!writeSummaryManually)}
                                className="text-blue-600 dark:text-blue-300 underline text-sm"
                            >
                                {writeSummaryManually ? t("hideSummaryButton") : t("manualSummaryButton")}
                            </button>

                            {writeSummaryManually && (
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-800 dark:text-white"
                                    rows={3}
                                    placeholder={t("manualSummaryPlaceholder")}
                                />
                            )}
                        </div>
                    </>
                )}

                {progress > 0 && (
                    <div className="w-full bg-gray-200 rounded h-4">
                        <div
                            className="bg-blue-500 h-4 rounded text-xs text-white text-center"
                            style={{width: `${progress}%`}}
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
