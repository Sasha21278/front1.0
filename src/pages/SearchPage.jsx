import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllDocuments } from "../services/api";
import DocumentList from "../components/DocumentList";

const SearchPage = () => {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const [allDocs, setAllDocs] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocs = async () => {
            setLoading(true);
            try {
                const res = await getAllDocuments();
                setAllDocs(res.data);
                setResults(res.data); // ← показываем всё по умолчанию
            } catch (e) {
                console.error("Ошибка загрузки документов:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchDocs();
    }, []);

    const handleSearch = () => {
        if (!query.trim()) {
            setResults(allDocs); // ← если строка пустая, показать всё
        } else {
            const filtered = allDocs.filter((doc) =>
                doc.title?.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t("search")}</h1>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("search")}
                    className="flex-1 border p-2 rounded"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {t("search")}
                </button>
            </div>

            {loading ? <p>{t("loadingDocuments")}</p> : <DocumentList documents={results} />}
        </div>
    );
};

export default SearchPage;
