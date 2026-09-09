import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Categories from "../pages/Categories";
import CreateSale from "../pages/CreateSale";
import CustomerDetails from "../pages/CustomerDetails";
import Customers from "../pages/Customers";
import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";
import Landing from "../pages/Landing";
import OrderDetails from "../pages/OrderDetails";
import Orders from "../pages/Orders";
import ProductDetails from "../pages/ProductDetails";
import Products from "../pages/Products";
import Profile from "../pages/Profile";
import Users from "../pages/Users";

import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
  <Routes>

    <Route path="/" element={<Landing />} />


    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>


    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/categories" element={<Categories />} />

        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetails />} />

        <Route path="/sales" element={<CreateSale />} />

        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />

        <Route path="/inventory" element={<Inventory />} />

        <Route element={<AdminRoute />}>
          <Route path="/users" element={<Users />} />
        </Route>

        <Route path="/profile" element={<Profile />} />
      </Route>
    </Route>


    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
