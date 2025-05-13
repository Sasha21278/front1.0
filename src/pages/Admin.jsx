import React, { useEffect, useState } from "react";
import {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllDocuments,
    deleteDocumentAdmin,
    getAdminStats,
} from "../services/api";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [stats, setStats] = useState(null);

    const fetchData = async () => {
        try {
            const [usersRes, docsRes, statsRes] = await Promise.all([
                getAllUsers(),
                getAllDocuments(),
                getAdminStats(),
            ]);
            setUsers(usersRes.data);
            setDocuments(docsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRoleChange = async (id, role) => {
        try {
            await updateUserRole(id, role);
            fetchData();
        } catch (e) {
            alert("Ошибка при изменении роли");
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Удалить пользователя?")) {
            await deleteUser(id);
            fetchData();
        }
    };

    const handleDeleteDoc = async (id) => {
        if (window.confirm("Удалить документ?")) {
            await deleteDocumentAdmin(id);
            fetchData();
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Административная панель</h1>

            {stats && (
                <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-100 p-4 rounded-xl shadow">
                        👤 <strong>Пользователей:</strong> {stats.users}
                    </div>
                    <div className="bg-green-100 p-4 rounded-xl shadow">
                        📄 <strong>Документов:</strong> {stats.documents}
                    </div>
                </div>
            )}

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Пользователи</h2>
                <div className="space-y-2">
                    {users.map((u) => (
                        <div
                            key={u.id}
                            className="bg-white shadow p-4 rounded-lg flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium">
                                    {u.username} ({u.email}) — <span className="italic">{u.role}</span>
                                </p>
                                <p className="text-sm text-gray-500">ID: {u.id}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleRoleChange(u.id, "ADMIN")}
                                    className="text-blue-600 hover:underline"
                                >
                                    Сделать админом
                                </button>
                                <button
                                    onClick={() => handleRoleChange(u.id, "USER")}
                                    className="text-green-600 hover:underline"
                                >
                                    Сделать юзером
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-2">Документы</h2>
                <div className="space-y-2">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white shadow p-4 rounded-lg flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium">
                                    {doc.title} (версия {doc.version})
                                </p>
                                <p className="text-sm text-gray-500">ID: {doc.id}</p>
                                <p className="text-sm text-gray-500">
                                    Пользователь: {doc.user?.username || "неизвестен"}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="text-red-600 hover:underline"
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;
