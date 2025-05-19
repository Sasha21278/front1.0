import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { downloadFile } from "../services/api";


const DocumentList = ({ documents }) => {
    const { t } = useTranslation();

    if (!documents || documents.length === 0) {
        return <p className="text-gray-500 mt-6 text-center">{t("noDocuments")}</p>;
    }

    const handleDownload = async (id, filename = "document.pdf") => {
        try {
            const response = await downloadFile(id);

            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Ошибка при скачивании. Возможно, файл не найден или вы не авторизованы.");
            console.error(error);
        }
    };


    const getReadableLabel = (key) => {
        switch (key) {
            case "wordCount":return t("wordCount")
            case "fileType": return t("fileType");
            case "pageCount": return t("pageCount");
            case "uploadDate": return t("uploadDate");
            case "language": return t("language");
            case "extractedDOI": return t("doi");
            case "keyword": return t("keyword");
            default: return key;
        }
    };

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => {
                const [expanded, setExpanded] = useState(false);

                return (
                    <div
                        key={doc.id}
                        className="relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                    {doc.type || t("document")}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800 leading-snug mb-1 line-clamp-2">
                                {doc.title || t("untitled")}
                            </h3>
                            <p className="text-sm text-gray-500 mb-1">
                                {t("author")}: {doc.user?.username || t("unknown")}
                            </p>
                            <p className="text-xs text-gray-400 mb-1">ID: {doc.id}</p>

                            <p className="text-sm font-semibold">{t("metadata")}:</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                                {(expanded ? doc.metadata : doc.metadata?.slice(0, 2))?.map((meta, i) => (
                                    <li key={i}>
                                        <span className="font-medium">
                                            {getReadableLabel(meta.metaKey)}
                                        </span>: {meta.value}
                                    </li>
                                ))}
                            </ul>

                            {doc.metadata?.length > 2 && (
                                <button
                                    className="mt-1 text-xs text-blue-600 hover:underline"
                                    onClick={() => setExpanded((prev) => !prev)}
                                >
                                    {expanded ? t("collapse") : t("expand")}
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => handleDownload(doc.id, `${doc.title || "document"}.pdf`)}
                            className="absolute top-3 right-3 text-blue-500 hover:underline text-sm"
                        >
                            {t("download")}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default DocumentList;
