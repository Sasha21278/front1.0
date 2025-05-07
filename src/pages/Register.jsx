import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { setUserToLocalStorage } from "../services/auth";

const Register = () => {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await register(form);
            setUserToLocalStorage(res.data);
            navigate("/home");
        } catch (err) {
            setError("Ошибка при регистрации. Возможно, логин или email уже занят.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">📝 Регистрация</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    name="username"
                    placeholder="Логин"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded text-sm"
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded text-sm"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded text-sm"
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700"
                >
                    Зарегистрироваться
                </button>
            </form>
        </div>
    );
};

export default Register;
