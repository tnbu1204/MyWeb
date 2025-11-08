import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [detailLoading, setDetailLoading] = useState(false);

    const viewOrder = async (orderId) => {
        setDetailLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`);
            const data = await res.json();
            setOrderDetails(data);
            setSelectedOrder(orderId);
        } catch (err) {
            toast.error("Không thể tải chi tiết đơn hàng");
        }
        setDetailLoading(false);
    };


    // 🟢 Gọi API lấy danh sách đơn hàng
    const fetchOrders = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/admin/orders");
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách đơn hàng:", err);
            toast.error("Không thể tải danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // 🟡 Cập nhật trạng thái đơn hàng
    const updateStatus = async (orderId, newStatus) => {
        if (!window.confirm("Bạn có chắc muốn đổi trạng thái đơn hàng này?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                toast.success("✅ Đã cập nhật trạng thái!");
                fetchOrders();
            } else {
                toast.error("Lỗi khi cập nhật trạng thái");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi kết nối server");
        }
    };

    if (loading) return <p className="text-center mt-10">⏳ Đang tải đơn hàng...</p>;

    if (!orders.length)
        return <p className="text-center mt-10 text-gray-600">Không có đơn hàng nào.</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">📦 Quản lý đơn hàng</h2>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg shadow-sm">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="border p-2">Mã ĐH</th>
                            <th className="border p-2">Khách hàng</th>
                            <th className="border p-2">SĐT</th>
                            <th className="border p-2">Tổng tiền</th>
                            <th className="border p-2">Thanh toán</th>
                            <th className="border p-2">Trạng thái</th>
                            <th className="border p-2">Ngày tạo</th>
                            <th className="border p-2">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o.id} className="text-center hover:bg-gray-50">
                                <td className="border p-2 font-semibold text-gray-700">#{o.id}</td>
                                <td className="border p-2">
                                    <div>{o.name}</div>
                                    <div className="text-sm text-gray-500">{o.email}</div>
                                </td>
                                <td className="border p-2">{o.phone}</td>
                                <td className="border border-black p-2 text-red-600 font-bold">
                                    {Number(o.total).toLocaleString("vi-VN")}₫
                                </td>
                                <td className="border p-2">{o.payment_method}</td>
                                <td className="border p-2">
                                    <span
                                        className={`px-2 py-1 rounded ${o.status === "Hoàn thành"
                                            ? "bg-green-100 text-green-700"
                                            : o.status === "Đang xử lý"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : o.status === "Đang giao"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {o.status}
                                    </span>
                                </td>
                                <td className="border p-2">
                                    {new Date(o.create_at).toLocaleString("vi-VN")}
                                </td>

                                <td className="border p-2 flex flex-col gap-2 justify-center">
                                    <button
                                        onClick={() => viewOrder(o.id)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                    >
                                        Xem chi tiết
                                    </button>

                                    <select
                                        value={o.status}
                                        onChange={(e) => updateStatus(o.id, e.target.value)}
                                        className="border rounded p-1"
                                    >
                                        <option value="Đang xử lý">Đang xử lý</option>
                                        <option value="Đang giao">Đang giao</option>
                                        <option value="Hoàn thành">Hoàn thành</option>
                                        <option value="Đã hủy">Đã hủy</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                    <div className="bg-white p-5 rounded shadow-lg w-4xl">
                        <h3 className="text-xl font-bold mb-3">📄 Chi tiết đơn #{selectedOrder}</h3>

                        {detailLoading ? (
                            <p>Đang tải...</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 max-h-148 overflow-y-auto p-2">
                                {orderDetails.map((item, index) => (
                                    <div key={index} className="flex gap-4 border rounded-lg p-3 shadow-sm hover:shadow-md transition">

                                        {/* Ảnh */}
                                        <img
                                            src={`http://localhost:5000/uploads/${item.image}`}
                                            className="w-32 h-40 object-cover rounded-lg border"
                                        />

                                        {/* Thông tin */}
                                        <div className="flex flex-col justify-between text-base leading-relaxed w-full">

                                            <div className="font-semibold text-lg text-gray-800">
                                                {item.name}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-blue-600 font-medium">Số lượng: {item.quantity}</span>
                                                <span className="text-red-600 font-medium">Tồn kho: {item.stock}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <span>Giới tính: {item.gender}</span>
                                                <span>Danh mục: {item.category}</span>
                                            </div>

                                            <div className="text-lg font-bold text-amber-600">
                                                {Number(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                            </div>

                                            <button
                                                className="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-1 rounded transition"
                                            >
                                                Chỉnh sửa
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className="mt-4 w-full bg-red-500 text-white py-2 rounded"
                            onClick={() => setSelectedOrder(null)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
