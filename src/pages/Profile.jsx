import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/api";

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getCurrentUser()
            .then(setUser)
            .catch((err) => console.error("Ошибка получения профиля:", err));
    }, []);

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">👤 Профиль</h1>

            {!user ? (
                <p className="text-gray-500">Загрузка...</p>
            ) : (
                <div className="bg-white shadow-md rounded-xl p-6 space-y-3">
                    <div><span className="font-medium">Имя пользователя:</span> {user.username}</div>
                    <div><span className="font-medium">Email:</span> {user.email || "—"}</div>
                    <div><span className="font-medium">ID:</span> {user.id}</div>
                    <div><span className="font-medium">Дата регистрации:</span> {user.createdAt || "неизвестно"}</div>
                </div>
            )}
        </div>
    );
}

export default Profile;
