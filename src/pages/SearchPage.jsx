import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getAllDocuments, searchDocuments } from "../services/api";
import DocumentList from "../components/DocumentList";

const FACULTY_KEYS = [
    "faculty_nature",
    "faculty_philosophy",
    "faculty_education",
    "faculty_art",
    "faculty_medicine",
    "faculty_social"
];

const SearchPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [author, setAuthor] = useState("");
    const [type, setType] = useState("");
    const [year, setYear] = useState("");
    const [keyword, setKeyword] = useState("");
    const [language, setLanguage] = useState("");
    const [faculty, setFaculty] = useState("");
    const [supervisor, setSupervisor] = useState("");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await getAllDocuments();
                setResults(res.data);
            } catch (err) {
                console.error("Ошибка загрузки документов:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await searchDocuments({
                title: query || undefined,
                author: author || undefined,
                type: type || undefined,
                year: year || undefined,
                keyword: keyword || undefined,
                language: language || undefined,
                faculty: faculty || undefined,
                supervisor: supervisor || undefined
            });
            setResults(res.data);
        } catch (err) {
            console.error("Ошибка поиска:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm text-blue-600 hover:underline"
            >
                ← {t("back")}
            </button>

            <h1 className="text-2xl font-bold mb-4">{t("search")}</h1>

            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("title")}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder={t("author")}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    value={supervisor}
                    onChange={(e) => setSupervisor(e.target.value)}
                    placeholder={t("supervisorLabel")}
                    className="border p-2 rounded"
                />
                <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">{t("facultyLabel")}</option>
                    {FACULTY_KEYS.map((key) => (
                        <option key={key} value={key}>
                            {t(key)}
                        </option>
                    ))}
                </select>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">{t("type")}</option>
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                </select>
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">{t("year")}</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                </select>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={t("keyword")}
                    className="border p-2 rounded"
                />
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">{t("language")}</option>
                    <option value="cs">cs</option>
                    <option value="ru">ru</option>
                    <option value="en">en</option>
                </select>
            </div>

            <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
            >
                {t("search")}
            </button>

            {loading ? (
                <p>{t("loadingDocuments")}</p>
            ) : (
                <DocumentList documents={results} />
            )}
        </div>
    );
};

export default SearchPage;
