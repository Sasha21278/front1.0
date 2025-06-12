import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getVersions, downloadFile } from "../services/api";

const getExtensionFromMetadata = (version) => {
    const typeMeta = version.metadata?.find(m => m.metaKey.toLowerCase() === "filetype");
    let ext = "pdf";
    const typeValue = (typeMeta && typeMeta.value) || version.type;
    if (typeValue) {
        if (typeValue.toLowerCase().includes("docx")) ext = "docx";
        else if (typeValue.toLowerCase().includes("doc")) ext = "doc";
        else if (typeValue.toLowerCase().includes("pdf")) ext = "pdf";
        else if (typeValue.toLowerCase().includes("pptx")) ext = "pptx";
        else if (typeValue.toLowerCase().includes("odt")) ext = "odt";
    }
    return ext;
};

const getDownloadFileName = (version) => {
    const ext = getExtensionFromMetadata(version);
    const safeTitle = (version.title || "document").replace(/[^a-zA-Z0-9а-яА-ЯёЁ_\-\.]/g, "_");
    return `${safeTitle}.${ext}`;
};

const Versions = ({ docId, onClose }) => {
    const { t } = useTranslation();
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!docId) return;
        setLoading(true);
        getVersions(docId)
            .then(res => setVersions(res.data))
            .catch(() => setVersions([]))
            .finally(() => setLoading(false));
    }, [docId]);

    const handleDownload = async (id, filename) => {
        try {
            const res = await downloadFile(id);
            const blob = res.data;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            alert(t("download_error_retry"));
        }
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-lg text-gray-400 hover:text-red-500"
                    aria-label={t("close")}
                >
                    ✕
                </button>
                <h2 className="text-xl font-semibold mb-4">{t("documentVersions")}</h2>
                {loading ? (
                    <div>{t("loading")}</div>
                ) : versions.length === 0 ? (
                    <div className="text-gray-500">{t("noVersionsFound")}</div>
                ) : (
                    <ul className="space-y-3">
                        {versions.map((v) => (
                            <li key={v.id} className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <span className="font-bold">{t("version")}: {v.version}</span>
                                    <br />
                                    <span className="text-xs text-gray-500">{t("fileName")}: {getDownloadFileName(v)}</span>
                                    <br />
                                    <span className="text-xs text-gray-400">ID: {v.id}</span>
                                </div>
                                <button
                                    onClick={() => handleDownload(v.id, getDownloadFileName(v))}
                                    className="text-blue-600 hover:underline"
                                >
                                    {t("download")}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Versions;
