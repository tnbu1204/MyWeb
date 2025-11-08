import { toast } from "react-hot-toast";

export default function ProductCard({ product }) {
    // them vao gio hang
    const addToCart = async () => {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
            toast("Vui lòng đăng nhập trước khi thêm vào giỏ hàng!", {
                icon: "🔒",
                duration: 4000, // 4 giây
                style: {
                    border: "1px solid #f87171", // viền đỏ nhạt
                    background: "#fee2e2",        // nền đỏ nhạt
                    color: "#b91c1c",             // chữ đỏ đậm
                    fontWeight: "600",
                },
            });
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    product_id: product.id,
                    quantity: 1
                })
            })

            const data = await res.json();
            // ✅ Hiển thị thông báo
            if (res.ok) {
                toast.success(data.message || "Đã thêm vào giỏ hàng!");
            } else {
                toast.error(data.message || "Có lỗi xảy ra!");
            }
        } catch (err) {
            console.log("Lỗi khi thêm vào giỏ:", err);
        }
    }

    return (
        <div className="group relative flex flex-col items-center border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-4">
            {/* Badge giới tính với màu riêng */}
            <span
                className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full
            ${product.gender === "Nam"
                        ? "bg-blue-100 text-blue-700"
                        : product.gender === "Nữ"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-purple-100 text-purple-700"
                    }`}
            >
                {product.gender === "Nam"
                    ? "Nam"
                    : product.gender === "Nữ"
                        ? "Nữ"
                        : "Unisex"}
            </span>

            {/* Badge loại quần áo (áo/quần/váy) */}
            <span
                className={`absolute top-10 left-3 text-xs font-semibold px-2 py-1 rounded-full
            ${product.category === "Áo"
                        ? "bg-green-100 text-green-700"
                        : product.category === "Quần"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-orange-100 text-orange-700"
                    }`}
            >
                {product.category === "Áo"
                    ? "Áo"
                    : product.category === "Quần"
                        ? "Quần"
                        : "Váy"}
            </span>

            {/* Ảnh sản phẩm */}
            <div className="w-full h-56 flex items-center justify-center overflow-hidden rounded-xl mb-3">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Tên và giá */}
            <h3 className="font-semibold text-gray-800 text-center line-clamp-1">
                {product.name}
            </h3>
            <p className="text-blue-600 font-semibold text-lg mt-1">
                {product.price.toLocaleString("vi-VN")}₫
            </p>

            {/* Nút thêm giỏ */}
            <button
                onClick={addToCart}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition"
            >
                🛒 Thêm vào giỏ
            </button>
        </div>
    );
}
