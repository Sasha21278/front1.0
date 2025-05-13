import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import DocumentUpload from "./components/DocumentUpload";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";

const App = () => {
    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <>
            <BrowserRouter>
                {isLoggedIn && <Navbar />}
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/upload" element={<PrivateRoute><DocumentUpload /></PrivateRoute>} />
                    <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>

            <Toaster position="top-right" />
        </>
    );
};

export default App;
