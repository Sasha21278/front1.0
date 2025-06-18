import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { uploadNewVersion } from "../services/api.js";

const UploadNewVersionModal = ({ isOpen, onClose, documentId, onUploaded }) => {
    const { t } = useTranslation();
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentId", documentId);

        try {
            await uploadNewVersion(formData);
            onUploaded();
            onClose();
        } catch (err) {
            alert(t("upload_fail"));
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl p-6 w-80 shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-lg text-gray-400 hover:text-red-500"
                    aria-label={t("close")}
                >✕</button>
                <h2 className="text-lg font-bold mb-4">{t("uploadNewVersion")}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                        className="mb-4 block w-full text-sm text-gray-800 dark:text-gray-100
                                   file:mr-4 file:py-2 file:px-4
                                   file:rounded-full file:border-0
                                   file:text-sm file:font-semibold
                                   file:bg-blue-50 dark:file:bg-gray-700 file:text-blue-700
                                   hover:file:bg-blue-100 dark:hover:file:bg-gray-600"
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                        >
                            {t("back")}
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            {t("upload")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadNewVersionModal;
