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
            const docs = Array.isArray(res.data)
                ? res.data
                : res.data.documents || [];
            console.log("user.id:", user?.id);
            console.log("documents:", docs.map(d => ({ id: d.id, userId: d.user?.id })));

            // фильтруем только документы текущего пользователя
            // const userDocs = docs.filter(doc => doc.user?.id === user.id);
            const userDocs = docs.filter(doc => String(doc.user?.id) === String(user.id));
            setAllDocuments(userDocs);
        } catch (err) {
            console.error("Ошибка при загрузке документов:", err);
            setAllDocuments([]);
        } finally {
            setLoading(false);
        }
    };
    console.log("👤 Пользователь:", user);
    console.log("📄 Документы:", allDocuments);

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            clearUser();
            navigate("/login");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-white border-r p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">OSU BPdisk</h2>
                <nav className="flex flex-col gap-2">
                    <button className="text-left p-2 rounded hover:bg-blue-100">Мои документы</button>
                    <button className="text-left p-2 rounded hover:bg-blue-100">Одобренные</button>
                    <button className="text-left p-2 rounded hover:bg-blue-100">Архив</button>
                    <button
                        onClick={handleLogout}
                        className="text-left mt-4 p-2 text-red-600 hover:bg-red-100 rounded"
                    >
                        Выйти
                    </button>
                </nav>
            </aside>

            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">
                    Добро пожаловать, {user?.username || "пользователь"}
                </h1>

                <DocumentUpload onUploaded={fetchDocuments} />

                {loading ? (
                    <p className="text-gray-500 mt-6">Загрузка документов...</p>
                ) : (
                    <DocumentList documents={allDocuments} />
                )}
            </main>
        </div>
    );
};

export default Home;
