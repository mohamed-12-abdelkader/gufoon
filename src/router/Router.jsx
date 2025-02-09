import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Admin from "../pages/admin/Admin";
import Home from "../pages/home/Home";
import AddBrand from "../components/admin/AddBrand";
import AddDiscount from "../components/admin/AddDiscount";
import GlassesDetails from "../pages/glasses/GlassesDetails";
import Login from "../pages/login/Login";
import Cart from "../pages/cart/Cart";
import MenSunglasses from "../pages/sunGlasses/MenSunglasses";
import AddGlasses from "../components/admin/AddGlasses";
import AddLenses from "../components/admin/AddLenses";
import WomenSunGlasses from "../pages/sunGlasses/WomenSunGlasses";
import MenPrescriptionGlasses from "../pages/prescriptionGlasses/MenPrescriptionGlasses";
import WomenPrescriptionGlasses from "../pages/prescriptionGlasses/WomenPrescriptionGlasses";
import CheldrinPrescriptionGlasses from "../pages/prescriptionGlasses/CheldrinPrescriptionGlasses";
import GlassesOffer from "../pages/offer/GlassesOffer";
import LensesDetails from "../pages/lenses/LensesDetails";
import MangeSalary from "../components/admin/MangeSalary";
import LensesOffer from "../pages/offer/LensesOffer";
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
import { Navigate } from "react-router-dom";
import ProductsCategories from "../pages/ProductsCategories";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

const Router = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/men_sunglasses" element={<MenSunglasses />} />
        <Route path="/women_sunglasses" element={<WomenSunGlasses />} />
        <Route path="/men_prescription_glasses" element={<MenPrescriptionGlasses />} />
        <Route path="/glasses_offer" element={<GlassesOffer />} />
        <Route path="/lenses_offer" element={<LensesOffer />} />
        <Route path="/women_prescription_glasses" element={<WomenPrescriptionGlasses />} />
        <Route path="/children_prescription_glasses" element={<CheldrinPrescriptionGlasses />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="product/:id/:type_id" element={<GlassesDetails />} />
        <Route path="lenses/:id" element={<LensesDetails />} />

        {/* Private Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        >
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
