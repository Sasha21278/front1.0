import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated, logout } from "../services/auth";

function Navbar() {
    const [loggedIn, setLoggedIn] = useState(isAuthenticated());
    const navigate = useNavigate();

    useEffect(() => {
        // Отслеживаем изменения токена
        const interval = setInterval(() => {
            setLoggedIn(isAuthenticated());
        }, 500); // каждые 500 мс проверяем токен (очень лёгко)

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };


    return (
        <nav className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
            <Link to="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Ostravska Univerzita" className="h-10" />
            </Link>
            <div className="flex items-center gap-4">
                {loggedIn ? (
                    <>
                        <Link to="/profile" className="text-blue-600 hover:underline">
                            Профиль
                        </Link>
                        <button onClick={handleLogout} className="text-red-600 hover:underline">
                            Выйти
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Войти
                        </Link>
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Регистрация
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
