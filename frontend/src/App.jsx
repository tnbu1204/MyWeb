import "./index.css";
import { Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header"
import Footer from "./components/Footer";
import Register from "./pages/register";
import Login from "./pages/login";
import Products from "./pages/products";
import Home from "./pages/Home";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import MyOrders from "./pages/myorders";
import OrderDetail from "./pages/orderdetail";
import AdminLayout from "./pages/admin/adminLayOut";
import AdminProducts from "./pages/admin/adminProducts";
import AdminOrders from "./pages/admin/adminOrders";
import AdminUsers from "./pages/admin/adminUsers";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />

      <Header />

      <div className="flex-1">
        <Routes>
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetail />} />
        </Routes>

        <Toaster position="bottom-right" />
      </div>

      <Footer />
    </div>
  )
}

export default App
