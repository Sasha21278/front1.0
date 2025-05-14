import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import SearchPage from "./pages/SearchPage";
import DocumentUpload from "./components/DocumentUpload";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import Settings from "./components/Settings.jsx";
import "./i18n";

const App = () => {
    const isLoggedIn = !!localStorage.getItem("token");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
            <BrowserRouter>
                {isLoggedIn && <Navbar />}
                <Routes>
                    <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
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
