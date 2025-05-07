import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocuments, logout } from "../services/api";
import { getUserFromLocalStorage, clearUser } from "../services/auth";
import DocumentUpload from "../components/DocumentUpload";
import DocumentList from "../components/DocumentList";

const Home = () => {
    const [allDocuments, setAllDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
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
            console.error("Ошибка при загрузке документов:", err);
            setAllDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            clearUser();
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r px-6 py-4 shadow-md">
                <div className="text-2xl font-bold text-blue-600 mb-8">📚 OSU BPdisk</div>
                <nav className="flex flex-col space-y-2">
                    <button className="text-left px-3 py-2 rounded hover:bg-blue-100 text-gray-700">📄 Мои документы</button>
                    <button className="text-left px-3 py-2 rounded hover:bg-blue-100 text-gray-700">✅ Одобренные</button>
                    <button className="text-left px-3 py-2 rounded hover:bg-blue-100 text-gray-700">📦 Архив</button>
                    <button onClick={handleLogout} className="text-left px-3 py-2 rounded text-red-600 hover:bg-red-100 mt-6">🚪 Выйти</button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-semibold mb-6">
                    👋 Добро пожаловать, <span className="text-blue-600">{user?.username}</span>
                </h1>

                <div className="mb-6">
                    <DocumentUpload onUploaded={fetchDocuments} />
                </div>

                {loading ? (
                    <p className="text-gray-500">Загрузка документов...</p>
                ) : (
                    <DocumentList documents={allDocuments} />
                )}
            </main>
        </div>
    );
};

export default Home;
