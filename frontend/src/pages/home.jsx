import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 🌈 Hero section */}
            <section className="relative bg-linear-to-r from-teal-800 to-purple-800 text-white py-20">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                        🛍️ Mua sắm thỏa thích cùng <span className="text-yellow-300">MyShop</span>
                    </h1>
                    <p className="text-lg md:text-xl mt-8 text-gray-100">
                        Nơi bạn tìm thấy mọi sản phẩm yêu thích với giá siêu ưu đãi.
                    </p>
                </div>
                <div className="absolute inset-0 bg-[url('/banner.jpg')] bg-cover bg-center opacity-20"></div>
            </section>

            {/* 🧱 Danh sách sản phẩm nổi bật */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    🌟 Sản phẩm nổi bật
                </h2>

                {products.length === 0 ? (
                    <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {/* Hiển thị tối đa 6 sản phẩm */}
                            {products.slice(0, 8).map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col"
                                >
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="h-56 w-full object-contain p-4"
                                    />
                                    <div className="px-4 pb-4 flex-1 flex flex-col">
                                        <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-blue-600 font-medium mt-2 mb-3">
                                            {Number(product.price).toLocaleString("vi-VN")}₫
                                        </p>
                                        <Link
                                            to={`/products`}
                                            className="mt-auto text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Nút xem tất cả */}
                        <div className="text-center mt-10">
                            <Link
                                to="/products"
                                className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                            >
                                Xem tất cả sản phẩm →
                            </Link>
                        </div>
                    </>
                )}
            </section>

            {/* ✨ Banner quảng cáo */}
            <section className="flex flex-col gap-4 bg-indigo-100 py-12 text-center">
                <h3 className="text-2xl font-bold text-gray-700">
                    🎁 Ưu đãi đặc biệt tháng này!
                </h3>
                <p className="text-gray-600">
                    Giảm giá đến <span className="font-semibold text-red-600">50%</span> cho nhiều sản phẩm hot.
                </p>
            </section>
        </div>
    );
}
