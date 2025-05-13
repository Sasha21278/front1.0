import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/api";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    if (!token) return null; // ⛔️ Не показываем navbar, если нет токена

    const handleLogout = () => {
        logout().finally(() => {
            localStorage.removeItem("token");
            navigate("/");
        });
    };

    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img src="/logo.png" alt="Logo" className="h-8" />
                    <span className="font-bold text-lg text-blue-800">OSU BPdisk</span>
                </div>
                <nav className="space-x-4">
                    <Link to="/home" className="text-sm hover:underline">🏠 Домой</Link>
                    <Link to="/profile" className="text-sm hover:underline">👤 Профиль</Link>
                    <Link to="/admin" className="text-sm hover:underline">⚙️ Администрирование</Link>
                    <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Выйти</button>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
