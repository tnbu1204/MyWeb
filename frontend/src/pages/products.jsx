import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Products() {
    const [products, setProducts] = useState([]);

    // 🔹 Gọi API khi component được mount
    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.log("Lỗi khi lấy sản phẩm:", err))
    }, []);

    const [filters, setFilters] = useState({
        category: "all", // áo | quần | váy | all
        gender: "all"    // nam | nữ | all
    });

    const filteredProducts = products.filter((p) => {
        const matchCategory = filters.category === "all" || p.category === filters.category;
        const matchGender = filters.gender === "all" || p.gender === filters.gender;

        return matchCategory && matchGender;
    });


    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-10">
                <div className="flex gap-4 mb-6">
                    {/* Lọc loại sản phẩm */}
                    <select
                        className="border px-3 py-2 rounded"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option value="all">Tất cả loại</option>
                        <option value="Áo">Áo</option>
                        <option value="Quần">Quần</option>
                        <option value="Váy">Váy</option>
                    </select>

                    {/* Lọc theo giới tính */}
                    <select
                        className="border px-3 py-2 rounded"
                        value={filters.gender}
                        onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                    >
                        <option value="all">Tất cả giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((p, index) => (
                        <ProductCard key={index} product={p} />
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Products;