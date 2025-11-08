import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
    });

    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password || !form.confirmPassword || !form.email || !form.phoneNumber) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Mật khẩu nhập lại không khớp!");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ // stringify giup chuyen doi du lieu thanh JSON ("key": "value") thay vi (key: "value")
                    username: form.username,
                    email: form.email,
                    phoneNumber: form.phoneNumber,
                    password: form.password,
                    confirmPassword: form.confirmPassword
                })
            });

            // cấu hình status ở backend để xác định khi nào là thông báo lỗi => ko reset form
            if (res.ok) {
                setForm({
                    username: "",
                    email: "",
                    phoneNumber: "",
                    password: "",
                    confirmPassword: ""
                });
                navigate("/login");
                toast.success("Đăng ký thành công!!!");
            }
            const data = await res.json();
            setError(data.message);

        } catch (err) {
            console.error("Lỗi khi gửi request:", err); // console log loi~
            setError("Lỗi kết nối server"); // tang trai nghiem nguoi dung
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-4xl shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Đăng ký</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Tên đăng nhập"
                        value={form.username}
                        onChange={handleChange}
                        className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Số điện thoại"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                        className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Nhập Lại Mật khẩu"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded-2xl hover:bg-blue-700 transition"
                    >
                        Đăng Ký
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register;