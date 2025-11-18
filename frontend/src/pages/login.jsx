import { useState } from "react";
import toast from "react-hot-toast";
import { replace, useNavigate } from "react-router-dom";

function Login() {
    const [form, setFrom] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFrom({ ...form, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            setError("Vui lòng nhập đầy đủ thông tin!");
        }

        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password
                })
            });

            const data = await res.json();
            if (res.ok) {
                setError(data.message);
                localStorage.setItem("user_id", data.userId);
                localStorage.setItem("username", data.username);
                localStorage.setItem("userEmail", data.userEmail);
                localStorage.setItem("userPhoneNumber", data.userPhoneNumber);
                localStorage.setItem("role", data.role);

                if (data.role === "admin") {
                    toast("Đã đăng nhập bằng tài khoản ADMIN!!!", {
                        icon: "🔒",
                        duration: 4000, // 4 giây
                        style: {
                            border: "1px solid #f87171", // viền đỏ nhạt
                            background: "#333",
                            color: "#FFF8E1",
                            fontWeight: "600"
                        },
                    });
                } else {
                    toast.success("Đăng nhập thành công!");
                }

                setTimeout(() => {
                    navigate("/", { replace: true });
                    window.location.reload();
                }, 1000);
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error("Lỗi khi gửi request:", err); // console log loi~
            setError("Lỗi kết nối server"); // tang trai nghiem nguoi dung
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-4xl shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Đăng nhập</h1>
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
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                        className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded-2xl hover:bg-blue-700 transition"
                    >
                        Đăng Nhập
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;