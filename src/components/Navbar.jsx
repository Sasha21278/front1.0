import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import { useTranslation } from "react-i18next";
import logoLight from "../assets/logo.png";
import logoDark from "../assets/logo_black.png";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { t } = useTranslation();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
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

    if (!token) return null;

    const handleLogout = () => {
        logout().finally(() => {
            localStorage.removeItem("token");
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
                    <Link to="/admin" className="text-sm hover:underline dark:text-white">⚙️ {t("admin")}</Link>
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
