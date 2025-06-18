import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAttachments, downloadAttachment } from "../services/api.js";

const AttachmentsModalReadOnly = ({ docId, onClose }) => {
    const { t } = useTranslation();
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttachments = async () => {
            setLoading(true);
            try {
                const res = await getAttachments(docId);
                setAttachments(res.data);
            } catch {
                setAttachments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAttachments();
    }, [docId]);

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl p-6 w-full max-w-lg shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-lg text-gray-400 hover:text-red-500"
                >✕</button>

                <h2 className="text-xl font-semibold mb-4">{t("attachments")}</h2>
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
                                <button
                                    onClick={() => handleDownload(att.id, att.filename)}
                                    className="text-blue-600 hover:underline"
                                >
                                    {t("download") || "Download"}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AttachmentsModalReadOnly;