import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Admin from "../pages/admin/Admin";
import Home from "../pages/home/Home";
import AddBrand from "../components/admin/AddBrand";
import AddDiscount from "../components/admin/AddDiscount";
import Login from "../pages/login/Login";
import Cart from "../pages/cart/Cart";
import AddGlasses from "../components/admin/AddGlasses";
import AddLenses from "../components/admin/AddLenses";
import MangeSalary from "../components/admin/MangeSalary";
import AllOrder from "../components/admin/AllOrder";
import Order from "../pages/order/Order";
import OrderConfirm from "../components/admin/OrderConfirm";
import AddColore from "../components/admin/AddColore";
import AddSize from "../components/admin/AddSize";
import AddFrameType from "../components/admin/AddFrameType";
import AddMaterial from "../components/admin/AddMaterial";
import AddFrameColore from "../components/admin/AddFrameColor";
import AddShap from "../components/admin/AddShap";
import AddLensesColore from "../components/admin/AddLensesColor";
import AddLensesType from "../components/admin/AddLensesType";
import AddLensesTyme from "../components/admin/AddLensesTime";
import MyOrders from "../pages/myorder/MyOrders";
import Profile from "../pages/profile/Profile";
import { useAuth } from "../contexts/AuthContext";
import Products from "../pages/Products";
import DetailedProduct from "../pages/DetailedProduct";

const ProtectedRoute = ({ children, isAdmin }) => {
  const { isAuthenticated, isAdmin: isAdminFun } = useAuth();

  if (!isAuthenticated()) return <Navigate to="/login" />;

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
          <Route path="add_brand" element={<AddBrand />} />
          <Route path="add_color" element={<AddColore />} />
          <Route path="add_shapes" element={<AddShap />} />
          <Route path="add_frame_color" element={<AddFrameColore />} />
          <Route path="add_size" element={<AddSize />} />
          <Route path="add_lens_time" element={<AddLensesTyme />} />
          <Route path="add_lens_type" element={<AddLensesType />} />
          <Route path="add_lens_color" element={<AddLensesColore />} />
          <Route path="add_material" element={<AddMaterial />} />
          <Route path="add_frame_type" element={<AddFrameType />} />
          <Route path="all_order" element={<AllOrder />} />
          <Route path="add_discount" element={<AddDiscount />} />
          <Route path="add_glasses" element={<AddGlasses />} />
          <Route path="add_lenses" element={<AddLenses />} />
          <Route path="mange_salary" element={<MangeSalary />} />
          <Route path="order-done" element={<OrderConfirm />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Router;
