import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 🟢 Lấy thông tin đơn hàng + sản phẩm
    useEffect(() => {
        // 1️⃣ Lấy thông tin đơn hàng
        fetch(`http://localhost:5000/api/orders/${id}`)
            .then((res) => res.json())
            .then((data) => setOrder(data))
            .catch((err) => console.error("Lỗi khi lấy thông tin đơn hàng:", err));

        // 2️⃣ Lấy chi tiết sản phẩm trong đơn hàng
        fetch(`http://localhost:5000/api/orders/${id}/items`)
            .then((res) => res.json())
            .then((data) => setItems(data))
            .catch((err) => console.error("Lỗi khi lấy chi tiết đơn hàng:", err));
    }, [id]);

    // 🛑 Hủy đơn hàng
    const handleCancel = () => {
        if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;

        setLoading(true);
        fetch(`http://localhost:5000/api/orders/${id}/cancel`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                setOrder((prev) => ({ ...prev, status: "Đã hủy" }));
                navigate("/myorders");
            })
            .catch((err) => console.error("Lỗi khi hủy đơn hàng:", err))
            .finally(() => setLoading(false));
    };

    if (!order)
        return (
            <div className="text-center mt-20 text-gray-600 text-lg">
                Đang tải thông tin đơn hàng...
            </div>
        );

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-blue-600 mb-4 text-center">
                Chi tiết đơn hàng #{id}
            </h1>

            <Link to="/myorders" className="text-blue-500 hover:underline mb-4 block">
                ← Quay lại danh sách đơn hàng
            </Link>

            {/* 🟢 Thông tin đơn hàng */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-semibold mb-2">Thông tin đơn hàng</h2>
                <p><span className="font-semibold">Tên người nhận:</span> {order.name}</p>
                <p><span className="font-semibold">Số điện thoại:</span> {order.phone}</p>
                <p><span className="font-semibold">Email:</span> {order.email}</p>
                <p><span className="font-semibold">Địa chỉ:</span> {order.address}</p>
                <p><span className="font-semibold">Phương thức thanh toán:</span> {order.payment_method}</p>
                <p>
                    <span className="font-semibold">Trạng thái:</span>{" "}
                    <span
                        className={`${order.status === "Đã hủy"
                            ? "text-red-600"
                            : order.status === "Đã giao"
                                ? "text-green-600"
                                : "text-yellow-600"
                            } font-semibold`}
                    >
                        {order.status}
                    </span>
                </p>
                <p><span className="font-semibold">Tổng tiền: </span>{Number(order.total).toLocaleString("vi-VN")}₫</p>
            </div>

            {/* 🟢 Danh sách sản phẩm */}
            {items.length === 0 ? (
                <p className="text-center text-gray-600">Không có sản phẩm trong đơn hàng này.</p>
            ) : (
                <>
                    <ul className="space-y-4">
                        {items.map((item, index) => (
                            <li key={index} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-gray-600">
                                            {item.price.toLocaleString("vi-VN")}₫ × {item.quantity}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-red-600 font-semibold">
                                    {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                </p>
                            </li>
                        ))}
                    </ul>

                    {/* 🟥 Nút Hủy đơn */}
                    {order.status !== "Đã hủy" && order.status !== "Hoàn thành" && order.status !== "Đang giao" && (
                        <div className="text-center mt-6">
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
                            >
                                {loading ? "Đang hủy..." : "Hủy đơn hàng"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
