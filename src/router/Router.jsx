import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Admin from "../pages/admin/Admin";
import Home from "../pages/home/Home";
import AddBrand from "../components/admin/AddBrand";
import AddDiscount from "../components/admin/AddDiscount";
import Login from "../pages/login/Login";
import Cart from "../pages/cart/Cart";
import AllOrder from "../components/admin/AllOrder";
import Order from "../pages/order/Order";
import AddColore from "../components/admin/AddColor";
import MyOrders from "../pages/myorder/MyOrders";
import Profile from "../pages/profile/Profile";
import { useAuth } from "../contexts/AuthContext";
import Products from "../pages/Products";
import DetailedProduct from "../pages/DetailedProduct";
import AddProduct from "../components/admin/addProduct";
import CategoryManager from "../components/admin/addCategory";
import UpdateProduct from "../components/admin/UpdateProduct";
import SalesDashboard from "../components/admin/SalesDashboard";
import { NotificationBell } from "../contexts/Notifications";
import Coupons from "../components/admin/Coupons";

const ProtectedRoute = ({ children, isAdmin }) => {
  const { isAuthenticated, isAdmin: isAdminFun } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (isAdmin && !isAdminFun()) return <Navigate to="/" />;

  return children;
};

const Router = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:product_id" element={<DetailedProduct />} />
        <Route path="/categories/:category_slug" element={<Products />} />
        <Route path="/offers" element={<Products offers={true} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/orders" element={<MyOrders />} />

        {/* Protected User Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute isAdmin>
            <Admin />
          </ProtectedRoute>
        }>
          <Route path="add_product" element={<AddProduct />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="notifications" element={<NotificationBell />} />
          <Route path="sales" element={<SalesDashboard />} />
          <Route path="update_product/:id" element={<UpdateProduct />} />
          <Route path="add_category" element={<CategoryManager />} />
          <Route path="add_brand" element={<AddBrand />} />
          <Route path="add_color" element={<AddColore />} />
          <Route path="all_order" element={<AllOrder />} />
          <Route path="add_discount" element={<AddDiscount />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Router;
