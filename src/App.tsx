import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Navbar, Footer, MobileNavDock } from "./components/Layout";
import { AdminSidebar } from "./components/AdminSidebar";
import { useAuth } from "./context/AuthContext";

// User Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Wishlist from "./pages/Wishlist";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminInvoice from "./pages/admin/Invoice";
import AdminReports from "./pages/admin/Reports";
import AdminTrustedClients from "./pages/admin/TrustedClients";
import AdminWebsiteSettings from "./pages/admin/WebsiteSettings";
import AdminProfile from "./pages/admin/AdminProfile";
import ScrollToTop from "./components/ScrollToTop";

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ScrollToTop />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Spacer so content is not hidden behind the dock on mobile */}
      <div className="h-16 md:hidden"></div>
      <MobileNavDock />
    </div>
  );
}

function AdminLayout() {
  const { user } = useAuth();
  if (!user || user.role !== "admin") return <Navigate to="/admin/login" />;

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8 print:p-0">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id/invoice" element={<AdminInvoice />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="trusted-clients" element={<AdminTrustedClients />} />
        <Route path="settings" element={<AdminWebsiteSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
}
