import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Settings = () => {
    const { t, i18n } = useTranslation();

    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
    const [language, setLanguage] = useState(() => localStorage.getItem("language") || "ru");

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        i18n.changeLanguage(language);
        localStorage.setItem("language", language);
    }, [language, i18n]);

    const handleThemeToggle = () => {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6">{t("settings")}</h2>

            <div className="mb-4">
                <label className="block mb-2 font-medium">{t("theme")}</label>
                <button
                    onClick={handleThemeToggle}
                    className="px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700"
                >
                    {theme === "dark" ? t("dark") : t("light")}
                </button>
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">{t("language")}</label>
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700"
                >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                    <option value="cs">Čeština</option>
                </select>
            </div>
        </div>
    );
};

export default Settings;
