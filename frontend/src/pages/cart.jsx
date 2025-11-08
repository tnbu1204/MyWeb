import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const navigate = useNavigate();
    const { cart, setCart, fetchCart } = useCart();
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        if (userId) fetchCart(userId);
    }, [userId]);

    // 🟢 Gọi API cập nhật số lượng
    const updateQuantity = async (id, newQuantity) => {
        try {
            await fetch(`http://localhost:5000/api/cart/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity: newQuantity }),
            });
            fetchCart(userId); // reload lại giỏ hàng sau khi cập nhật
        } catch (err) {
            console.error("Lỗi khi cập nhật số lượng:", err);
        }
    };

    // 🔵 Gọi API xóa sản phẩm
    const deleteItem = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/cart/${id}`, { method: "DELETE" });
            fetchCart(userId); // load lại giỏ hàng
        } catch (err) {
            console.error("Lỗi khi xóa sản phẩm:", err);
        }
    };

    if (!cart.length) return <p className="text-center text-gray-600 mt-10">🛒 Giỏ hàng trống</p>;

    // Tính tổng tiền
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Giỏ hàng của bạn</h1>

            <ul className="space-y-6">
                {cart.map(item => (
                    <li key={item.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg border"
                            />
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-gray-600">{item.price.toLocaleString("vi-VN")}₫</p>

                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                    >-</button>

                                    <span className="w-8 text-center">{item.quantity}</span>

                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >+</button>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-gray-700 font-medium">
                                {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                            </p>
                            <button
                                onClick={() => deleteItem(item.id)}
                                className="text-red-500 hover:underline text-sm mt-2"
                            >
                                Xóa
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-6 flex justify-between items-center">
                <p className="text-lg font-bold">
                    Tổng tiền:{" "}
                    <span className="text-red-600">
                        {total.toLocaleString("vi-VN")}₫
                    </span>
                </p>
                <button
                    onClick={() => navigate("/checkout")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Thanh toán
                </button>
            </div>
        </div>
    );
}
