import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { setUserToLocalStorage } from "../services/auth";

const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [showRegister, setShowRegister] = useState(false);
    const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form);
            setUserToLocalStorage(res.data);
            navigate("/home");
        } catch {
            setError("Неверный логин или пароль");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://195.113.104.72:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUserToLocalStorage(data);
            navigate("/home");
        } catch (err) {
            setError("Ошибка регистрации");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    {showRegister ? "Регистрация" : "Вход"}
                </h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {showRegister ? (
                    <form onSubmit={handleRegister} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Логин"
                            value={registerForm.username}
                            onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        >
                            Зарегистрироваться
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Логин"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Войти
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center">
                    <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => setShowRegister(!showRegister)}
                    >
                        {showRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
