import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    getProfile,
    updateProfile,
    changePassword,
    getUserDocuments,
    deleteDocument,
} from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
    const { t, i18n } = useTranslation();
    const [user, setUser] = useState(null);
    const [docs, setDocs] = useState([]);
    const [editData, setEditData] = useState({ username: "", email: "" });
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

    useEffect(() => {
        getProfile().then((res) => {
            setUser(res.data);
            setEditData({ username: res.data.username, email: res.data.email });
            getUserDocuments(res.data.id).then((docsRes) => setDocs(docsRes.data));
        });
    }, []);

    const handleProfileSave = async () => {
        try {
            await updateProfile(user.id, editData);
            toast.success(t("profile_updated"));
        } catch (e) {
            toast.error(t("profile_update_error"));
        }
    };

    const handleChangePassword = async () => {
        try {
            await changePassword(user.id, passwords);
            toast.success(t("password_changed"));
            setPasswords({ oldPassword: "", newPassword: "" });
        } catch (e) {
            toast.error(t("password_change_error"));
        }
    };

    const handleDeleteDoc = async (id) => {
        if (window.confirm(t("confirm_delete_document"))) {
            await deleteDocument(id);
            setDocs(docs.filter((d) => d.id !== id));
        }
    };

    const changeLang = (lng) => i18n.changeLanguage(lng);

    if (!user) return <div className="p-6">{t("loading_profile")}</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{t("userProfile")}</h1>

            <div className="space-y-4">
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
                <button onClick={handleProfileSave} className="bg-blue-600 text-white px-4 py-2 rounded">
                    {t("saveChanges")}
                </button>
            </div>

            <div className="mt-10 space-y-4">
                <h2 className="text-xl font-semibold">{t("changePassword")}</h2>
                <div>
                    <label className="block font-medium">{t("currentPassword")}</label>
                    <input
                        type="password"
                        value={passwords.oldPassword}
                        onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                        className="border p-2 w-full rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">{t("newPassword")}</label>
                    <input
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="border p-2 w-full rounded"
                    />
                </div>
                <button onClick={handleChangePassword} className="bg-green-600 text-white px-4 py-2 rounded">
                    {t("changePassword")}
                </button>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-2">{t("myDocuments")}</h2>
                {docs.length === 0 ? (
                    <p>{t("noDocuments")}</p>
                ) : (
                    <div className="space-y-3">
                        {docs.map((doc) => (
                            <div key={doc.id} className="border p-4 rounded flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{doc.title}</p>
                                    <p className="text-sm text-gray-500">{t("version")}: {doc.version}</p>
                                </div>
                                <button onClick={() => handleDeleteDoc(doc.id)} className="text-red-600 hover:underline">
                                    {t("delete")}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
