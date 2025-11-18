import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function Header() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const { cart, fetchCart } = useCart(); //
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [openMenu, setOpenMenu] = useState(false); // <<< NEW

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

            <div className="hidden text-2xl font-bold text-blue-600 lg:flex items-center gap-2">MyShop</div>

            {/* BUTTON MENU MOBILE */}
            <button
                className="lg:hidden text-3xl absolute"
                onClick={() => setOpenMenu(true)}
            >
                ☰
            </button>

            <div className="text-2xl font-bold text-blue-600 lg:hidden mx-auto">MyShop</div>

            <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex gap-6 text-gray-700 font-medium mx-auto ">
                <Link to={"/"} className={isActive("/") ? "font-bold underline" : ""}>Trang chủ</Link>
                <Link to={"/products"} className={isActive("/products") ? "font-bold underline" : ""}>Sản phẩm</Link>
                <Link to={"/cart"} className={isActive("/cart") ? "font-bold underline" : ""}>Giỏ hàng</Link>
                <Link to={"/myorders"} className={isActive("/myorders") ? "font-bold underline" : ""}>Đơn hàng</Link>
            </div>

            {openMenu && (
                <div
                    className="fixed inset-0 lg:hidden"
                    onClick={() => setOpenMenu(false)}
                />
            )}

            <div
                className={`fixed top-0 left-0 h-full w-64 bg-amber-50 shadow-xl z-50 p-6 transform transition-transform duration-300 lg:hidden
                ${openMenu ? "translate-x-0" : "-translate-x-full"}`}
            >
                <button
                    className="text-2xl mb-4"
                    onClick={() => setOpenMenu(false)}
                >
                    ✕
                </button>


                <div className="flex flex-col gap-4 text-gray-800 text-xl font-medium">
                    <Link to="/" className={isActive("/") ? "font-bold underline" : ""} onClick={() => setOpenMenu(false)}>Trang chủ</Link>
                    <Link to="/products" className={isActive("/products") ? "font-bold underline" : ""} onClick={() => setOpenMenu(false)}>Sản phẩm</Link>
                    <Link to="/cart" className={isActive("/cart") ? "font-bold underline" : ""} onClick={() => setOpenMenu(false)}>Giỏ hàng</Link>
                    <Link to="/myorders" className={isActive("/myorders") ? "font-bold underline" : ""} onClick={() => setOpenMenu(false)}>Đơn hàng</Link>
                </div>

                {user ? (
                    // da dang nhap
                    <div className="flex flex-col items-center gap-3 text-gray-800 text-xl font-medium absolute bottom-2 left-0 right-0">
                        <div className="text-gray-800">Xin chào, <b>{user.username}</b> 👋</div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                            Đăng xuất
                        </button>
                    </div>
                ) : ""}


            </div>

            {user ? (
                // da dang nhap
                <div className="flex items-center gap-3">
                    <span className="text-gray-800 hidden lg:inline">Xin chào, <b>{user.username}</b> 👋</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 hidden lg:inline"
                    >
                        Đăng xuất
                    </button>
                </div>
            ) : (
                // chua dang nhap
                <div className="flex gap-3 items-center absolute right-4">
                    <Link to={"/register"} className="text-yellow-700 text-lg font-bold py-2 hover:underline transition hidden sm:inline">Đăng Ký</Link>
                    <span className="hidden sm:inline">or</span>
                    <Link to={"/login"} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Đăng nhập</Link>
                </div>
            )}

        </div>
    )
}

export default Header;