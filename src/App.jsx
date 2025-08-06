import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./components/Settings.jsx";
import "./i18n.js";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }, []);

    useEffect(() => {
        const onStorage = () => setIsLoggedIn(!!localStorage.getItem("token"));
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
            <BrowserRouter>
                {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
                <Routes>
                    <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/reg" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
            <Toaster position="top-right" />
        </div>
    );
};

export default App;
