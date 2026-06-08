import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, List, ShoppingBag, BarChart3, LogOut, Home, Users, Settings, User } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/context/AuthContext";

export function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: List, label: "Categories", path: "/admin/categories" },
    { icon: Users, label: "Trusted Clients", path: "/admin/trusted-clients" },
    { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
    { icon: BarChart3, label: "Reports", path: "/admin/reports" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
    { icon: User, label: "Profile", path: "/admin/profile" },
  ];

  return (
    <div className="flex flex-col h-screen w-64 border-r bg-muted/10 print:hidden">
      <div className="p-6">
        <Link to="/" className="text-xl font-bold tracking-tighter">OSLO BD ADMIN</Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              location.pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t space-y-2">
        <Link to="/">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Home className="h-4 w-4" />
            Back to Store
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
