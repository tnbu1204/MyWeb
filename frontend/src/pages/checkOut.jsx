import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const [form, setForm] = useState({
        name: "",
        phone: localStorage.getItem("userPhoneNumber") == "null" ? "" : localStorage.getItem("userPhoneNumber"),
        email: localStorage.getItem("userEmail") == "null" ? "" : localStorage.getItem("userEmail"),
        address: "",
        payment: "cod", // Mặc định là thanh toán khi nhận hàng
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        console.log(form)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user_id = localStorage.getItem("user_id");

        try {
            const cartResponse = await fetch(`http://localhost:5000/api/cart/${user_id}`);
            const cartItems = await cartResponse.json();

            const res = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id,
                    ...form,
                    cartItems,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                navigate("/myorders")
                toast.success("Đặt hàng thành công 🎉");
            } else {
                alert("❌ " + data.message);
            }
        } catch (err) {
            console.error("Lỗi khi đặt hàng:", err);
            alert("Có lỗi xảy ra khi đặt hàng");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Thông tin thanh toán</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Họ và tên</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Số điện thoại</label>
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Địa chỉ giao hàng</label>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    ></textarea>
                </div>

                <div>
                    <label className="block font-medium mb-2">Hình thức thanh toán</label>
                    <select
                        name="payment"
                        value={form.payment}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                        <option value="bank">Chuyển khoản ngân hàng</option>
                        <option value="momo">Ví MoMo</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Xác nhận đặt hàng
                </button>
            </form>
        </div>
    );
}
