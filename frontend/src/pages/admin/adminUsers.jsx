import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/admin/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("loi khi tai thong tin tai khoan khach hang", err);
            toast.error("Không thể tải thông tin tài khoản khách hàng!!!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa người dùng này !!?")) return;

        const res = await fetch(`http://localhost:5000/api/admin/users/delete/${id}`, {
            method: "DELETE"
        });
        const data = await res.json();

        if (res.ok) {
            toast.success(data.message);
            fetchUsers();
        } else {
            toast.error(data.message);
        }
    }

    if (loading) return <p className="text-center mt-10">⏳ Đang tải tài khoản khách hàng...</p>;

    return (
        <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">👥 Quản lý người dùng</h2>

            <table className="w-full border border-gray-300 rounded-lg shadow-sm">
                <thead className="bg-blue-50">
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Username</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">SĐT</th>
                        <th className="border p-2">Tổng đơn hàng</th>
                        <th className="border p-2">Tổng chi tiêu</th>
                        <th className="border p-2">Ngày tạo</th>
                        <th className="border p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className="text-center hover:bg-gray-50">
                            <td className="border p-2 font-semibold text-gray-700">#{u.id}</td>
                            <td className="border p-2">{u.username}</td>
                            <td className="border p-2">{u.email}</td>
                            <td className="border p-2">{u.phoneNumber}</td>
                            <td className="border p-2">{u.tongdonhang}</td>
                            <td className="border border-black p-2 text-red-600 font-bold">{Number(u.tongchitieu).toLocaleString("vi-VN")}₫</td>
                            <td className="border p-2">{new Date(u.create_at).toLocaleString("vi-VN")}</td>
                            <td className="border p-2">
                                {u.id === 1 ? "" : <button onClick={() => handleDelete(u.id)} className="bg-red-600 p-2 rounded-md text-white hover:bg-red-800">Xóa tài khoản</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}