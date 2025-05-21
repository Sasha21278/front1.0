import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllDocuments,
    deleteDocumentAdmin,
    getAdminStats,
} from "../services/api";

const Admin = () => {
    const { t } = useTranslation();
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
            console.error(t("error_loading_data"), error);
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
            alert(t("error_changing_role"));
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm(t("confirm_delete_user"))) {
            await deleteUser(id);
            fetchData();
        }
    };

    const handleDeleteDoc = async (id) => {
        if (window.confirm(t("confirm_delete_document"))) {
            await deleteDocumentAdmin(id);
            fetchData();
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto text-gray-900 dark:text-white">
            <h1 className="text-3xl font-bold mb-4">{t("adminPanel")}</h1>

            {stats && (
                <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-xl shadow">
                        👤 <strong>{t("users")}:</strong> {stats.users}
                    </div>
                    <div className="bg-green-100 dark:bg-green-800 p-4 rounded-xl shadow">
                        📄 <strong>{t("documents")}:</strong> {stats.documents}
                    </div>
                </div>
            )}

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">{t("users")}</h2>
                <div className="space-y-2">
                    {users.map((u) => (
                        <div key={u.id}
                             className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-medium">{u.username} ({u.email}) — <span
                                    className="italic">{u.role}</span></p>
                                <p className="text-sm text-gray-500 dark:text-gray-300">ID: {u.id}</p>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => handleRoleChange(u.id, "ADMIN")}
                                        className="text-blue-600 dark:text-blue-300 hover:underline">
                                    {t("makeAdmin")}
                                </button>
                                <button onClick={() => handleRoleChange(u.id, "USER")}
                                        className="text-green-600 dark:text-green-300 hover:underline">
                                    {t("makeUser")}
                                </button>
                                <button onClick={() => handleDeleteUser(u.id)}
                                        className="text-red-600 dark:text-red-400 hover:underline">
                                    {t("delete")}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-2">{t("documents")}</h2>
                <div className="space-y-2">
                    {documents.map((doc) => (
                        <div key={doc.id}
                             className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-medium">{doc.title} ({t("version")}: {doc.version})</p>
                                <p className="text-sm text-gray-500 dark:text-gray-300">ID: {doc.id}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-300">{t("author")}: {doc.user?.username || t("unknown")}</p>
                            </div>
                            <button onClick={() => handleDeleteDoc(doc.id)}
                                    className="text-red-600 dark:text-red-400 hover:underline">
                                {t("delete")}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;
