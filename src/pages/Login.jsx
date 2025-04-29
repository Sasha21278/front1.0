import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { setUserToLocalStorage } from "../services/auth";
import * as res from "autoprefixer";

const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    localStorage.setItem("token", res.data.accessToken);


    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form);
            setUserToLocalStorage(res.data);
            navigate("/home");
        } catch (err) {
            setError("Неверный логин или пароль");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-semibold mb-4">Вход в систему</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <input
                    name="username"
                    placeholder="Логин"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Войти
                </button>
            </form>
        </div>
    );
};

export default Login;
