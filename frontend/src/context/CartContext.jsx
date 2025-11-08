import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Lấy giỏ hàng từ backend
    const fetchCart = async (userId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
            const data = await res.json();
            setCart(data);
        } catch (err) {
            console.error("Lỗi khi lấy giỏ hàng:", err);
        }
    };

    return (
        <CartContext.Provider value={{ cart, setCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
