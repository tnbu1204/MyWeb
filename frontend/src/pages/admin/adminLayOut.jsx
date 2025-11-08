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
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <h1 className="text-2xl font-bold text-center py-4 border-b border-gray-700">
                    ⚙️ Admin Panel
                </h1>
                <nav className="flex-1 p-3 space-y-2">
                    {menu.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === item.path ? "bg-gray-700" : ""
                                }`}
                        >
                            {item.label}
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
