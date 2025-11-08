import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function Header() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const { cart, fetchCart } = useCart(); //
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        const storedId = localStorage.getItem("user_id")

        if (storedId && storedUser) {
            setUser({ username: storedUser, id: storedId });
            fetchCart(storedId); //
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("user_id");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userPhoneNumber");
        localStorage.removeItem("role");
        setUser(null);
        navigate("/");
        window.location.reload();
    }

    return (
        <div className="relative flex items-center justify-between px-8 py-4 bg-white shadow-md">
            <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">MyShop</div>

            <div className="absolute left-1/2 -translate-x-1/2 flex gap-6 text-gray-700 font-medium mx-auto">
                <Link to={"/"} className={isActive("/") ? "font-bold underline" : ""}>Trang chủ</Link>
                <Link to={"/products"} className={isActive("/products") ? "font-bold underline" : ""}>Sản phẩm</Link>
                <Link to={"/cart"} className={isActive("/cart") ? "font-bold underline" : ""}>Giỏ hàng</Link>
                <Link to={"/myorders"} className={isActive("/myorders") ? "font-bold underline" : ""}>Đơn hàng</Link>
            </div>

            {user ? (
                // da dang nhap
                <div className="flex items-center gap-3">
                    <span className="text-gray-800">Xin chào, <b>{user.username}</b> 👋</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                        Đăng xuất
                    </button>
                </div>
            ) : (
                // chua dang nhap
                <div className="flex gap-3 items-center">
                    <Link to={"/register"} className="text-yellow-700 text-lg font-bold py-2 hover:underline transition">Đăng Ký</Link>
                    or
                    <Link to={"/login"} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Đăng nhập</Link>
                </div>
            )}

        </div>
    )
}

export default Header;