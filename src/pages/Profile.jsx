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
            <h1 className="text-3xl font-bold mb-4">👤 Профиль пользователя</h1>

            {!user ? (
                <p className="text-gray-500">Загрузка...</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                    <p><span className="font-semibold">Имя пользователя:</span> {user.username}</p>
                    <p><span className="font-semibold">Email:</span> {user.email || "—"}</p>
                    <p><span className="font-semibold">ID:</span> {user.id}</p>
                    <p><span className="font-semibold">Дата регистрации:</span> {user.createdAt || "неизвестно"}</p>
                </div>
            )}
        </div>
    );
}

export default Profile;
