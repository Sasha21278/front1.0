import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { register } from "../services/api";
import { setUserToLocalStorage } from "../services/auth";

const Register = () => {
    const { t, i18n } = useTranslation();
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const changeLanguage = (lang) => i18n.changeLanguage(lang);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await register(form);
            setUserToLocalStorage(res.data);
            navigate("/home");
        } catch (err) {
            setError(t("registration_error"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="mb-4 text-right space-x-2">
                    <button onClick={() => changeLanguage("en")} className="text-sm text-gray-500 hover:underline">EN</button>
                    <button onClick={() => changeLanguage("ru")} className="text-sm text-gray-500 hover:underline">RU</button>
                    <button onClick={() => changeLanguage("cs")} className="text-sm text-gray-500 hover:underline">CS</button>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-gray-800">📝 {t("register")}</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input name="username" placeholder={t("username")} value={form.username} onChange={handleChange} className="w-full mb-3 p-2 border rounded text-sm" />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full mb-3 p-2 border rounded text-sm" />
                <input type="password" name="password" placeholder={t("password")} value={form.password} onChange={handleChange} className="w-full mb-4 p-2 border rounded text-sm" />
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700">
                    {t("register")}
                </button>
            </form>
        </div>
    );
};

export default Register;
