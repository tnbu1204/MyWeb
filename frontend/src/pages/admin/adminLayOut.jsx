import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
    const location = useLocation();

    const menu = [
        { path: "/admin/products", label: "🛍️ Sản phẩm" },
        { path: "/admin/orders", label: "📦 Đơn hàng" },
        { path: "/admin/users", label: "👥 Người dùng" },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* SIDEBAR */}
            <aside className="bg-gray-800 text-white flex flex-col lg:w-54 w-20">
                <h1 className="text-2xl font-bold text-center py-4 border-b border-gray-700">
                    ⚙️ <span className="hidden lg:inline">Admin Panel</span>
                </h1>
                <nav className="flex-1 p-3 space-y-2">
                    {menu.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === item.path ? "bg-gray-700" : ""}`}
                        >
                            <span className="block">{item.label.split(" ")[0]} <span className="hidden lg:inline">{item.label.split(" ").slice(1).join(" ")}</span></span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}
