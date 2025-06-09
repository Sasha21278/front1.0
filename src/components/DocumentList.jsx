import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { downloadFile, getVersions } from "../services/api";
import UploadNewVersionModal from "./UploadNewVersionModal";
import Versions from "./Versions";
import AttachmentsModal from "./AttachmentsModal";

const getExtensionFromMetadata = (doc) => {
    const typeMeta = doc.metadata?.find(m => m.metaKey.toLowerCase() === "filetype");
    let ext = "pdf";
    const typeValue = (typeMeta && typeMeta.value) || doc.type;
    if (typeValue) {
        if (typeValue.toLowerCase().includes("docx")) ext = "docx";
        else if (typeValue.toLowerCase().includes("doc")) ext = "doc";
        else if (typeValue.toLowerCase().includes("pdf")) ext = "pdf";
        else if (typeValue.toLowerCase().includes("pptx")) ext = "pptx";
        else if (typeValue.toLowerCase().includes("odt")) ext = "odt";
    }
    return ext;
};

const getDownloadFileName = (doc) => {
    const ext = getExtensionFromMetadata(doc);
    const safeTitle = (doc.title || "document").replace(/[^a-zA-Z0-9а-яА-ЯёЁ_\-\.]/g, "_");
    return `${safeTitle}.${ext}`;
};

const DocumentList = ({ documents }) => {
    const { t } = useTranslation();
    const [expandedDocs, setExpandedDocs] = useState({});
    const [versionsByDocId, setVersionsByDocId] = useState({});
    const [modalOpenFor, setModalOpenFor] = useState(null);
    const [showVersionsFor, setShowVersionsFor] = useState(null);
    const [showAttachmentsFor, setShowAttachmentsFor] = useState(null);

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
            alert(t("download_error_retry"));
            console.error(error);
        }
    };

    const toggleExpand = (id) => {
        setExpandedDocs(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getReadableLabel = (key) => {
        switch (key) {
            case "wordCount": return t("wordCount");
            case "fileType": return t("fileType");
            case "pageCount": return t("pageCount");
            case "uploadDate": return t("uploadDate");
            case "language": return t("language");
            case "extractedDOI": return t("doi");
            case "keyword": return t("keyword");
            case "supervisor": return t("supervisor");
            case "summary": return t("summary");
            case "faculty": return t("facultyLabel");
            default: return key;
        }
    };

    const translateFaculty = (key) => {
        const keys = [
            "faculty_nature",
            "faculty_philosophy",
            "faculty_education",
            "faculty_art",
            "faculty_medicine",
            "faculty_social"
        ];
        return keys.includes(key) ? t(key) : key;
    };

    const fetchVersions = async (docId) => {
        try {
            const res = await getVersions(docId);
            setVersionsByDocId(prev => ({ ...prev, [docId]: res.data }));
        } catch (err) {
            console.error(err);
        }
    };

    if (!documents || documents.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400 mt-6 text-center">{t("noDocuments")}</p>;
    }

    const sortedDocs = [...documents].sort((a, b) => b.id - a.id);

    return (
        <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedDocs.map((doc) => {
                    const expanded = expandedDocs[doc.id] || false;
                    const summary = doc.metadata?.find(m => m.metaKey === "summary");
                    const keywords = doc.metadata?.filter(m => m.metaKey === "keyword");
                    const otherMetadata = doc.metadata?.filter(m => !["summary", "keyword"].includes(m.metaKey));

                    return (
                        <div key={doc.id} className="relative bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full font-medium">
                                        {doc.type || t("document")}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold leading-snug mb-1 line-clamp-2">
                                    {doc.title || t("untitled")}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                                    {t("author")}: {doc.user?.username || t("unknown")}
                                </p>
                                <p className="text-xs text-gray-400 mb-1">ID: {doc.id}</p>

                                {summary && summary.value !== t("noDescription") && (
                                    <p className="text-sm italic text-gray-700 dark:text-gray-200 mb-2">
                                        📝 {summary.value}
                                    </p>
                                )}

                                <div className="flex gap-2 flex-wrap mt-2">
                                    <button
                                        onClick={() => setShowVersionsFor(doc.id)}
                                        className="text-sm text-blue-600 font-bold underline"
                                    >
                                        {t("showVersions")}
                                    </button>
                                    <button
                                        onClick={() => setShowAttachmentsFor(doc.id)}
                                        className="text-sm text-purple-600 hover:underline"
                                    >
                                        {t("attachments")}
                                    </button>
                                    <button
                                        onClick={() => setModalOpenFor(doc.id)}
                                        className="text-sm text-green-600 hover:underline"
                                    >
                                        {t("uploadNewVersion")}
                                    </button>
                                </div>

                                {versionsByDocId[doc.id]?.length > 1 ? (
                                    <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        {versionsByDocId[doc.id].map(v => (
                                            <li key={v.id} className="flex justify-between items-center">
                                                <span>{t("version")}: {v.version}</span>
                                                <button
                                                    onClick={() => handleDownload(v.id, getDownloadFileName(doc))}
                                                    className="text-xs text-blue-600 hover:underline"
                                                >
                                                    {t("download")}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    versionsByDocId[doc.id] && (
                                        <p className="text-xs text-gray-400 mt-1">{t("noOlderVersions")}</p>
                                    )
                                )}

                                {keywords?.length > 0 && (
                                    <details className="mb-2 cursor-pointer text-sm text-blue-600 dark:text-blue-300">
                                        <summary className="hover:underline">{t("showKeywords")}</summary>
                                        <ul className="list-disc list-inside mt-1">
                                            {keywords.map((kw, i) => (
                                                <li key={i}>{kw.value}</li>
                                            ))}
                                        </ul>
                                    </details>
                                )}

                                {otherMetadata?.length > 0 && (
                                    <>
                                        <p className="text-sm font-semibold">{t("metadata")}:</p>
                                        <ul className="text-sm list-disc list-inside">
                                            {(expanded ? otherMetadata : otherMetadata.slice(0, 3)).map((meta, i) => (
                                                <li key={i}>
                                                    <span className="font-medium">{getReadableLabel(meta.metaKey)}</span>: {meta.metaKey === "faculty" ? translateFaculty(meta.value) : meta.value}
                                                </li>
                                            ))}
                                        </ul>
                                        {otherMetadata.length > 3 && (
                                            <button onClick={() => toggleExpand(doc.id)} className="mt-1 text-xs text-blue-600 dark:text-blue-300 hover:underline">
                                                {expanded ? t("collapse") : t("expand")}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => handleDownload(doc.id, getDownloadFileName(doc))}
                                className="absolute top-3 right-3 text-blue-500 dark:text-blue-300 hover:underline text-sm"
                            >
                                {t("download")}
                            </button>

                            <UploadNewVersionModal
                                isOpen={modalOpenFor === doc.id}
                                onClose={() => setModalOpenFor(null)}
                                documentId={doc.id}
                                onUploaded={() => fetchVersions(doc.id)}
                            />
                        </div>
                    );
                })}
            </div>
            {showVersionsFor && (
                <Versions
                    docId={showVersionsFor}
                    onClose={() => setShowVersionsFor(null)}
                />
            )}
            {showAttachmentsFor && (
                <AttachmentsModal
                    docId={showAttachmentsFor}
                    onClose={() => setShowAttachmentsFor(null)}
                />
            )}
        </>
    );
};

export default DocumentList;
