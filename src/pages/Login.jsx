import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login } from "../services/api.js";
import { setUserToLocalStorage } from "../services/auth.js";

const Login = ({ setIsLoggedIn }) => {
    const { t, i18n } = useTranslation();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const changeLanguage = (lang) => i18n.changeLanguage(lang);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form);
            setUserToLocalStorage(res.data);
            setIsLoggedIn(true);
            navigate("/home");
        } catch {
            setError("Неверный логин или пароль");
        }
    };

    const location = useLocation();
    const [success, setSuccess] = useState(
        location.state && location.state.registered ? true : false
    );

    useEffect(() => {
        if (success) {
            window.history.replaceState({}, document.title);
        }
    }, [success]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="mb-4 text-right space-x-2">
                    <button onClick={() => changeLanguage("en")} className="text-sm text-gray-500 hover:underline">EN</button>
                    <button onClick={() => changeLanguage("ru")} className="text-sm text-gray-500 hover:underline">RU</button>
                    <button onClick={() => changeLanguage("cs")} className="text-sm text-gray-500 hover:underline">CS</button>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{t("login")}</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && (
                    <div className="mb-4 text-green-600 text-center">
                        {t("registration_success_login")}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-3">
                    <input type="text" placeholder={t("username")} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full p-2 border rounded text-gray-900" />
                    <input type="password" placeholder={t("password")} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full p-2 border rounded text-gray-900" />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        {t("login")}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button className="text-blue-600 hover:underline text-sm" onClick={() => navigate("/reg")}>
                        {t("no_account")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
