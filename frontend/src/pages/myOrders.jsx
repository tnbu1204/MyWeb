import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5000/api/orders/user/${userId}`)
                .then((res) => res.json())
                .then((data) => setOrders(data))
                .catch((err) => console.error("Lỗi khi lấy đơn hàng:", err));
        }
    }, [userId]);

    if (!userId)
        return (
            <div className="text-center mt-10">
                <p className="text-red-500 font-semibold">
                    ⚠️ Bạn cần đăng nhập để xem đơn hàng của mình
                </p>
                <Link to="/login" className="text-blue-600 underline">
                    Đăng nhập ngay
                </Link>
            </div>
        );

    if (orders.length === 0)
        return (
            <p className="text-center text-gray-600 mt-10">
                🛍️ Bạn chưa có đơn hàng nào.
            </p>
        );

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
                Đơn hàng của bạn
            </h1>

            <ul className="space-y-6">
                {orders.map((order) => (
                    <li
                        key={order.id}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-lg">
                                    Mã đơn hàng: #{order.id}
                                </p>
                                <p className="text-gray-600">
                                    Ngày đặt:{" "}
                                    {new Date(order.create_at).toLocaleString("vi-VN")}
                                </p>
                                <p className="text-gray-600">
                                    Tổng tiền:{" "}
                                    <span className="font-bold text-red-500">
                                        {Number(order.total).toLocaleString("vi-VN")}₫
                                    </span>
                                </p>
                                <p className="text-gray-600">
                                    Trạng thái:{" "}
                                    <span
                                        className={`font-semibold ${order.status === "Hoàn thành"
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </p>
                            </div>

                            <Link
                                to={`/order/${order.id}`}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Xem chi tiết
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
