import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getAttachments, uploadAttachment, downloadAttachment, deleteAttachment } from "../services/api.js";


const AttachmentsModal = ({ docId, onClose }) => {
    const { t } = useTranslation();
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef();

    const fetchAttachments = async () => {
        setLoading(true);
        try {
            const res = await getAttachments(docId);
            setAttachments(res.data);
        } catch (e) {
            setAttachments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAttachments(); }, [docId]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (selectedFile) {
            if (selectedFile.size > 100 * 1024 * 1024) {
                alert(t("attachment_too_large", "Maximum file size is 100MB"));
                return;
            }
            await uploadAttachment(docId, selectedFile);
            setSelectedFile(null);
            fetchAttachments();
        }
    };

    const handleDownload = async (id, filename) => {
        const res = await downloadAttachment(id);
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleDelete = async (id) => {
        if (window.confirm(t("delete_confirm", "Delete attachment?"))) {
            await deleteAttachment(id);
            fetchAttachments();
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl p-6 w-full max-w-lg shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-lg text-gray-400 hover:text-red-500"
                >✕</button>

                <h2 className="text-xl font-semibold mb-4">{t("attachments")}</h2>

                <div className="mb-4 flex items-center gap-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".zip"
                        style={{display: "none"}}
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                        onClick={() => fileInputRef.current.click()}
                    >
                        {t("choose_file") || "Choose file"}
                    </button>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                        {selectedFile ? selectedFile.name : t("no_file_chosen") || "No file chosen"}
                    </span>
                    <button
                        type="button"
                        className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:bg-gray-300"
                        onClick={handleUpload}
                        disabled={!selectedFile}
                    >
                        {t("upload") || "Upload"}
                    </button>


                </div>

                {loading ? (
                    <div>{t("loading")}</div>
                ) : (
                    <ul className="divide-y divide-gray-300 dark:divide-gray-600">
                        {attachments.length === 0 && (
                            <li className="text-gray-500 dark:text-gray-400">
                                {t("no_attachments") || "No attachments"}
                            </li>
                        )}
                        {attachments.map(att => (
                            <li key={att.id} className="flex justify-between items-center py-2">
                                <span className="truncate max-w-xs text-gray-800 dark:text-gray-100">{att.filename}</span>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleDownload(att.id, att.filename)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {t("download") || "Download"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(att.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        {t("delete") || "Delete"}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AttachmentsModal;
