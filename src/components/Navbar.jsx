import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/api.js";
import { useTranslation } from "react-i18next";
import logoLight from "../assets/logo.png";
import logoDark from "../assets/logo_black.png";

const Navbar = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [isDark, setIsDark] = useState(false);
    const [user, setUser] = useState(null);

    // Показывать Navbar только если не на /login или /register
    const hideNavbarRoutes = ["/", "/login", "/register"];
    if (hideNavbarRoutes.includes(location.pathname)) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // Тема
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });
        setIsDark(document.documentElement.classList.contains("dark"));
        return () => observer.disconnect();
    }, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // Читаем пользователя из localStorage (где ты сохраняешь {accessToken, username, role, ...})
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            setUser(userData || null);
        } catch {
            setUser(null);
        }
    }, [localStorage.getItem("user")]); // слушаем смену пользователя

    if (!localStorage.getItem("token")) return null;

    const handleLogout = () => {
        logout().finally(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
            navigate("/");
        });
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link to="/home">
                        <img src={isDark ? logoDark : logoLight} alt="Logo" className="h-8 cursor-pointer" />
                    </Link>
                </div>
                <nav className="space-x-4">
                    <Link to="/profile" className="text-sm hover:underline dark:text-white">👤 {t("profile")}</Link>
                    {user?.role === "ADMIN" && (
                        <Link to="/admin" className="text-sm hover:underline dark:text-white">⚙️ {t("admin")}</Link>
                    )}
                    <Link to="/settings" className="text-sm hover:underline dark:text-white">🛠️ {t("settings")}</Link>
                    <button onClick={handleLogout} className="text-sm text-red-600 hover:underline dark:text-red-400">
                        {t("logout")}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
