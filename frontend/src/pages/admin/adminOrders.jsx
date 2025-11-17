
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

    const handleUpdate = async (id, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const ok = window.confirm("Bạn có chắc muốn thay đổi số lượng sản phẩm?");
            if (!ok) return;

            const res = await fetch(`http://localhost:5000/api/admin/order/item/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity: newQuantity })
            });
            const data = await res.json();
            toast.success(data.message);

            // cập nhật UI và tránh lỗi update khi sử dụng quantity - 1 / quantity + 1
            setOrderDetails(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            )
        } catch (err) {
            toast.error("Lỗi khi cập nhật sản phẩm trong đơn hàng")
        }
    }

    const handleDelete = async (id) => {
        try {
            const ok = window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")
            if (!ok) return;

            const res = await fetch(`http://localhost:5000/api/admin/order/item/delete/${id}`, {
                method: "DELETE"
            })
            const data = await res.json();
            toast.success(data.message);

            setOrderDetails(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            toast.error("Lỗi khi xóa sản phẩm trong đơn hàng")
        }
    }

    // Gọi API lấy danh sách đơn hàng
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

    // Gọi API lấy stock theo order id
    const getStock = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/order/get-stock/${id}`);
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Lỗi khi getstock", err);
            toast.error("Lỗi khi get stock");
        }
    };

    const handleMinus = async (orderId) => {
        if (!confirm("Xác nhận trừ tồn kho cho đơn hàng này?")) return;

        try {
            // 1. Lấy danh sách sản phẩm trong đơn
            const stockData = await getStock(orderId);

            // 2. Kiểm tra đủ stock chưa
            const checkRes = await fetch("http://localhost:5000/api/admin/order/check-stock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: stockData })
            });
            const checkData = await checkRes.json();

            if (!checkRes.ok) {
                toast.error(checkData.errors[0].message);
                return;
            }

            // 3. Trừ stock
            const res = await fetch("http://localhost:5000/api/admin/order/minus-all", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: stockData, order_id: orderId })
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                return;
            }

            toast.success(data.message);

            // Cập nhật trạng thái minus_stock của order
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, minus_stock: 1 } : order
                )
            );

            const detailRes = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`);
            const updatedDetails = await detailRes.json();
            setOrderDetails(updatedDetails);

        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi trừ stock");
        }
    };


    useEffect(() => {
        fetchOrders();
    }, []);

    // Cập nhật trạng thái đơn hàng
    const updateStatus = async (orderId, newStatus) => {
        if (!window.confirm("Bạn có chắc muốn đổi trạng thái đơn hàng này?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
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
                                    <div className={`px-2 py-1 mb-1 rounded ${o.status === "Hoàn thành"
                                        ? "bg-green-100 text-green-700"
                                        : o.status === "Đang xử lý"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : o.status === "Đang giao"
                                                ? "bg-blue-100 text-blue-700"
                                                : o.status === "Đã hủy"
                                                    ? "bg-gray-100 text-gray-600"
                                                    : "bg-yellow-200 text-white-600"
                                        }`}>
                                        {o.status}
                                    </div>
                                    <div className={`px-2 py-1 rounded ${o.minus_stock === 0 ? "bg-yellow-400" : "bg-green-100"}`}>
                                        {o.minus_stock === 0 ? "Chưa trừ stock" : "Đã trừ stock"}
                                    </div>
                                </td>
                                <td className="border p-2">
                                    {new Date(o.create_at).toLocaleString("vi-VN")}
                                </td>

                                <td className="border p-2 ">
                                    <div className="mb-1 ">
                                        <button
                                            onClick={() => viewOrder(o.id)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                    <div>
                                        <select
                                            value={o.status}
                                            onChange={(e) => updateStatus(o.id, e.target.value)}
                                            className="border rounded p-1"
                                        >
                                            <option value="Chờ xác nhận">Chờ xác nhận</option>
                                            <option value="Đang xử lý">Đang xử lý</option>
                                            <option value="Đang giao">Đang giao</option>
                                            <option value="Hoàn thành">Hoàn thành</option>
                                            <option value="Đã hủy">Đã hủy</option>
                                        </select>
                                    </div>
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
                                                <span>{item.quantity > item.stock ? "⚠️" : ""}</span>
                                                <span className="text-red-600 font-medium">Tồn kho: {item.stock}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <span>Giới tính: {item.gender}</span>
                                                <span>Danh mục: {item.category}</span>
                                            </div>

                                            <div className="text-lg font-bold text-amber-600">
                                                {Number(item.price * item.quantity).toLocaleString("vi-VN")}₫ - {item.price.toLocaleString("vi-VN")} x1
                                            </div>

                                            {item.status === "Chờ xác nhận" && (
                                                <div className="grid grid-cols-3 gap-2">
                                                    <button
                                                        onClick={() => handleUpdate(item.id, item.quantity - 1)}
                                                        className={item.quantity == 1 ? "mt-2 bg-amber-500/50 text-white font-medium py-1 rounded" : "mt-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-1 rounded transition"}
                                                    >
                                                        -
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdate(item.id, item.quantity + 1)}
                                                        className="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-1 rounded transition"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="mt-2 bg-red-600 hover:bg-red-700 text-white font-medium py-1 rounded transition"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded"
                                onClick={() => handleMinus(selectedOrder)}
                            >
                                Trừ Stock
                            </button>
                            <button
                                className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded"
                                onClick={() => setSelectedOrder(null)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
