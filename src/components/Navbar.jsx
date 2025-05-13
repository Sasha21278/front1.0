import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../services/auth";
import { getProfile } from "../services/api";

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getProfile()
            .then((res) => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow-md">
            <Link to="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="OSU BPdisk" className="h-10" />
                <span className="text-xl font-bold text-blue-700">OSU BPdisk</span>
            </Link>

            <div className="flex items-center gap-4">
                {user && (
                    <>
                        <Link to="/home" className="text-blue-600 hover:underline">🏠 Домой</Link>

                        <Link to="/profile" className="text-blue-600 hover:underline">👤 Профиль</Link>

                        {user.role === "ADMIN" && (
                            <Link to="/admin" className="text-purple-600 font-semibold hover:underline">
                                🛠 Администрирование
                            </Link>
                        )}

                        <button onClick={handleLogout} className="text-red-600 hover:underline">
                            Выйти
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
