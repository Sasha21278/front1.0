import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    getProfile,
    updateProfile,
    changePassword,
    getDocuments,
    deleteDocument,
    downloadFile,
} from "../services/api";
import toast from "react-hot-toast";
import { getUserFromLocalStorage } from "../services/auth";

const Profile = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [docs, setDocs] = useState([]);
    const [editData, setEditData] = useState({ username: "", email: "" });
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

    useEffect(() => {
        const loadUserAndDocs = async () => {
            try {
                const profileRes = await getProfile();
                setUser(profileRes.data);
                setEditData({
                    username: profileRes.data.username,
                    email: profileRes.data.email,
                });

                const currentUser = getUserFromLocalStorage();
                const docsRes = await getDocuments();
                const userDocs = docsRes.data.filter((doc) =>
                    String(doc.user?.id) === String(currentUser.id)
                );
                setDocs(userDocs);
            } catch (e) {
                toast.error(t("load_documents_error"));
            }
        };

        loadUserAndDocs();
    }, []);

    const handleProfileSave = async () => {
        try {
            await updateProfile(user.id, editData);
            toast.success(t("profile_updated"));
        } catch {
            toast.error(t("profile_update_error"));
        }
    };

    const handleChangePassword = async () => {
        try {
            await changePassword(user.id, passwords);
            toast.success(t("password_changed"));
            setPasswords({ oldPassword: "", newPassword: "" });
        } catch {
            toast.error(t("password_change_error"));
        }
    };

    const handleDeleteDoc = async (id) => {
        if (window.confirm(t("confirm_delete_document"))) {
            try {
                await deleteDocument(id);
                setDocs((prev) => prev.filter((d) => d.id !== id));
            } catch {
                toast.error(t("delete_failed"));
            }
        }
    };

    const handleDownload = async (id, title) => {
        try {
            const response = await downloadFile(id);
            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${title || "document"}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error(t("download_failed"));
        }
    };

    if (!user) return <div className="p-6">{t("loading_profile")}</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{t("userProfile")}</h1>

            {/* Профиль */}
            <div className="space-y-4 mb-10">
                <div>
                    <label className="block font-medium">{t("username")}</label>
                    <input
                        type="text"
                        value={editData.username}
                        onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                        className="border p-2 w-full rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="border p-2 w-full rounded"
                    />
                </div>
                <button
                    onClick={handleProfileSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {t("saveChanges")}
                </button>
            </div>

            {/* Пароль */}
            <div className="space-y-4 mb-10">
                <h2 className="text-xl font-semibold">{t("changePassword")}</h2>
                <div>
                    <label className="block font-medium">{t("currentPassword")}</label>
                    <input
                        type="password"
                        value={passwords.oldPassword}
                        onChange={(e) =>
                            setPasswords({ ...passwords, oldPassword: e.target.value })
                        }
                        className="border p-2 w-full rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">{t("newPassword")}</label>
                    <input
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) =>
                            setPasswords({ ...passwords, newPassword: e.target.value })
                        }
                        className="border p-2 w-full rounded"
                    />
                </div>
                <button
                    onClick={handleChangePassword}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    {t("changePassword")}
                </button>
            </div>

            {/* Документы */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-2">{t("myDocuments")}</h2>
                <div className="space-y-2">
                    {docs.length === 0 ? (
                        <p>{t("noDocuments")}</p>
                    ) : (
                        docs.map((doc) => (
                            <div
                                key={doc.id}
                                className="bg-white shadow p-4 rounded-lg flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-medium">
                                        {doc.title} ({t("version")}: {doc.version})
                                    </p>
                                    <p className="text-sm text-gray-500">ID: {doc.id}</p>
                                    <p className="text-sm text-gray-500">
                                        {t("author")}: {doc.user?.username || t("unknown")}
                                    </p>
                                </div>
                                <div className="space-x-3">
                                    <button
                                        onClick={() => handleDownload(doc.id, doc.title)}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        {t("download")}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDoc(doc.id)}
                                        className="text-red-600 hover:underline text-sm"
                                    >
                                        {t("delete")}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
