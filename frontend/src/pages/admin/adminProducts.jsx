import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => { fetchProducts(); }, []);

    // THEM
    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        description: "",
        category: "",
        gender: "",
        image: null,
    });
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            const file = files[0];
            setForm({ ...form, image: file });

            if (file) {
                setPreview(URL.createObjectURL(file));
            } else {
                setPreview(null);
            }
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    // CHINH SUA
    const [editingProduct, setEditingProduct] = useState(null); // san pham dang chinh sua
    const [editForm, setEditForm] = useState({ // form chinh sua
        name: "",
        price: "",
        stock: "",
        description: "",
        category: "",
        gender: "",
        image: null,
    });
    const [editPreview, setEditPreview] = useState(null); // hinh anh chinh sua

    const handleEditClick = (product) => { // khi nhan vao nut chinh sua
        setEditingProduct(product); // set san pham dang chinh sua
        setEditForm({ // lay thong tin san pham dang chinh sua
            name: product.name,
            price: product.price,
            stock: product.stock,
            description: product.description,
            category: product.category,
            gender: product.gender,
            image: null,
        });
        setEditPreview(`http://localhost:5000/uploads/${product.image}`);
    };

    const handleEditChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            const file = files[0];
            setEditForm({ ...editForm, image: file });
            setEditPreview(file ? URL.createObjectURL(file) : null);
        } else {
            setEditForm({ ...editForm, [name]: value });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(); // dùng khi có file hoặc nhiều trường linh hoạt
        Object.keys(editForm).forEach((key) => { // duyet qua tung key cua editForm
            formData.append(key, editForm[key]) // them key, value vao formData
        });

        const res = await fetch(`http://localhost:5000/admin/update-product/${editingProduct.id}`, {
            method: "PUT",
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {
            toast.success("✅ Cập nhật thành công!");
            setEditingProduct(null);
            fetchProducts();
        } else {
            toast.error(data.message || "Lỗi cập nhật sản phẩm!");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(form).forEach((key) => formData.append(key, form[key]));

        const res = await fetch("http://localhost:5000/admin/add-product", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {
            toast.success("✅ Đã thêm sản phẩm!");
            setForm({ name: "", price: "", category: "", gender: "", stock: "", description: "", image: null });
            setPreview(null);
            fetchProducts();
        } else {
            toast.error(data.message || "Lỗi thêm sản phẩm!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa sản phẩm này?")) return;
        const res = await fetch(`http://localhost:5000/admin/delete-product/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (res.ok) {
            toast.success("🗑️ Đã xóa!");
            fetchProducts();
        } else {
            toast.error(data.message);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">🛍️ Quản lý sản phẩm</h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="grid gap-3 mb-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="Tên sản phẩm"
                        value={form.name}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            name="price"
                            placeholder="Giá"
                            value={form.price}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="number"
                            name="stock"
                            placeholder="Số lượng"
                            value={form.stock}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />
                    </div>

                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">-- Chọn loại quần áo --</option>
                        <option value="ao">Áo</option>
                        <option value="quan">Quần</option>
                        <option value="vay">Váy</option>
                    </select>

                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="nam">Nam</option>
                        <option value="nu">Nữ</option>
                        <option value="unisex">Unisex</option>
                    </select>

                    <textarea
                        name="description"
                        placeholder="Mô tả"
                        value={form.description}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    ></textarea>

                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded"
                    >
                        ➕ Thêm sản phẩm
                    </button>
                </div>

                <div className="grid place-items-center border rounded p-4 mb-6">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Xem trước sản phẩm"
                            className="max-h-80 rounded shadow"
                        />
                    ) : (
                        <p className="text-gray-500">Chưa chọn ảnh</p>
                    )}
                </div>
            </form>


            {/* DANH SÁCH */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                    <div key={p.id} className="border rounded p-3 bg-white shadow-sm">
                        <img src={`http://localhost:5000/uploads/${p.image}`} alt={p.name} className="w-full h-40 object-contain mb-2" />
                        <span className="">
                            <h4 className="font-semibold">{p.name}</h4>
                            <h2 className="font-semibold text-red-600">Tồn kho: {p.stock}</h2>
                        </span>
                        <p className="text-blue-600 font-medium">
                            {Number(p.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">{p.description}</p>
                        <div className="flex justify-around">
                            <button onClick={() => handleEditClick(p)} className="bg-blue-500 text-white w-40/100 rounded py-1 hover:bg-blue-600">
                                Chỉnh sửa
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white w-40/100 rounded py-1 hover:bg-red-600">
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* UPDATE */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-3xl relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                            onClick={() => setEditingProduct(null)}
                        >
                            ✖
                        </button>
                        <h3 className="text-xl font-bold mb-4">✏️ Chỉnh sửa sản phẩm</h3>

                        <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-2">
                            <div className="grid">
                                <label className="font-bold my-auto">Name</label>
                                <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="border p-2 rounded" required />

                                <label className="font-bold my-auto">Price</label>
                                <input type="number" name="price" value={editForm.price} onChange={handleEditChange} className="border p-2 rounded" required />

                                <label className="font-bold my-auto">Stock</label>
                                <input type="number" name="stock" value={editForm.stock} onChange={handleEditChange} className="border p-2 rounded" required />

                                <label className="font-bold my-auto">Category</label>
                                <select name="category" value={editForm.category} onChange={handleEditChange} className="border p-2 rounded" required>
                                    <option value="">-- Loại --</option>
                                    <option value="Áo">Áo</option>
                                    <option value="Quần">Quần</option>
                                    <option value="Váy">Váy</option>
                                </select>

                                <label className="font-bold my-auto">Gender</label>
                                <select name="gender" value={editForm.gender} onChange={handleEditChange} className="border p-2 rounded" required>
                                    <option value="">-- Giới tính --</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Unisex">Unisex</option>
                                </select>
                            </div>

                            <div className="grid">
                                <label className="font-bold my-auto">Decription</label>
                                <textarea name="description" value={editForm.description} onChange={handleEditChange} className="border p-2 rounded"></textarea>

                                <label className="font-bold my-auto">File Image</label>
                                <input type="file" name="image" onChange={handleEditChange} className="border p-2 rounded" />

                                {editPreview && <img src={editPreview} alt="Preview" className="max-h-40 object-contain mx-auto" />}
                            </div>

                            <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 col-span-2 ">
                                💾 Lưu thay đổi
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
