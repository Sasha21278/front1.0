import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { uploadNewVersion } from "../services/api";

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
            <div className="bg-white p-6 rounded-xl shadow-md w-80">
                <h2 className="text-lg font-bold mb-4">{t("uploadNewVersion")}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                        className="mb-4"
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                        >
                            {t("back")}
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
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
