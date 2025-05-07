import React from "react";

const DocumentList = ({ documents }) => {
    if (!documents || documents.length === 0) {
        return <p className="text-gray-500 mt-6 text-center">Нет загруженных документов.</p>;
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
                <div
                    key={doc.id}
                    className="relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col justify-between"
                >
                    <div>
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                {doc.type || "Документ"}
                            </span>
                            <span className="text-xs text-gray-400">ID: {doc.id}</span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 leading-snug mb-1 line-clamp-2">
                            {doc.title || "Без названия"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                            Автор: {doc.user?.username || "Неизвестен"}
                        </p>
                        <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                            {doc.description?.trim() || "Описание отсутствует."}
                        </p>
                    </div>

                    {doc.keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto pt-2">
                            {doc.keywords.map((kw, i) => (
                                <span
                                    key={i}
                                    className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
                                >
                                    {kw}
                                </span>
                            ))}
                        </div>
                    )}

                    <a
                        href={`/api/files/download/${doc.id}`}
                        className="absolute top-3 right-3 text-blue-500 hover:underline text-sm"
                    >
                        Скачать
                    </a>
                </div>
            ))}
        </div>
    );
};

export default DocumentList;
