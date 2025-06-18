import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getDocuments, logout } from "../services/api.js";
import { getUserFromLocalStorage, clearUser } from "../services/auth.js";
import DocumentUpload from "../components/DocumentUpload.jsx";
import DocumentList from "../components/DocumentList.jsx";

const Home = () => {
    const [allDocuments, setAllDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = getUserFromLocalStorage();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchDocuments();
        }
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await getDocuments();
            const docs = Array.isArray(res.data) ? res.data : res.data.documents || [];
            const userDocs = docs.filter(doc => String(doc.user?.id) === String(user.id));
            setAllDocuments(userDocs);
        } catch (err) {
            console.error(t("error_loading_docs"), err);
            setAllDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r px-6 py-4 shadow-md">
                <div className="text-2xl font-bold text-blue-600 dark:text-white mb-8">📚 OSU BPdisk</div>
                <nav className="flex flex-col space-y-2">
                    <button
                        onClick={() => navigate("/search")}
                        className="text-left px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white"
                    >
                        🔍 {t("search")}
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 text-gray-900 dark:text-white">
                <h1 className="text-3xl font-semibold mb-6">
                👋 {t("welcome")}, <span className="text-blue-600 dark:text-blue-400">{user?.username}</span>
                </h1>

                <div className="mb-6">
                    <DocumentUpload onUploaded={fetchDocuments} />
                </div>

                {loading ? (
                    <p className="text-gray-500 dark:text-gray-400">{t("loading_documents")}</p>
                ) : (
                    <DocumentList documents={allDocuments} />
                )}
            </main>
        </div>
    );
};

export default Home;
