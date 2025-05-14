import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login, register } from "../services/api";
import { setUserToLocalStorage } from "../services/auth";

const Login = () => {
    const { t, i18n } = useTranslation();
    const [form, setForm] = useState({ username: "", password: "" });
    const [showRegister, setShowRegister] = useState(false);
    const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const changeLanguage = (lang) => i18n.changeLanguage(lang);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form);
            setUserToLocalStorage(res.data);
            navigate("/home");
        } catch {
            setError(t("invalid_login"));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await register(registerForm);
            setUserToLocalStorage(res.data);
            navigate("/home");
        } catch {
            setError(t("registration_error"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="mb-4 text-right space-x-2">
                    <button onClick={() => changeLanguage("en")} className="text-sm text-gray-500 hover:underline">EN</button>
                    <button onClick={() => changeLanguage("ru")} className="text-sm text-gray-500 hover:underline">RU</button>
                    <button onClick={() => changeLanguage("cs")} className="text-sm text-gray-500 hover:underline">CS</button>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    {showRegister ? t("register") : t("login")}
                </h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {showRegister ? (
                    <form onSubmit={handleRegister} className="space-y-3">
                        <input type="text" placeholder={t("username")} value={registerForm.username} onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })} className="w-full p-2 border rounded" />
                        <input type="email" placeholder="Email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} className="w-full p-2 border rounded" />
                        <input type="password" placeholder={t("password")} value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} className="w-full p-2 border rounded" />
                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                            {t("register")}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-3">
                        <input type="text" placeholder={t("username")} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full p-2 border rounded" />
                        <input type="password" placeholder={t("password")} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full p-2 border rounded" />
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            {t("login")}
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center">
                    <button className="text-blue-600 hover:underline text-sm" onClick={() => setShowRegister(!showRegister)}>
                        {showRegister ? t("have_account") : t("no_account")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
