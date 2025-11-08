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

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((p, index) => (
                        <ProductCard key={index} product={p} />
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Products;