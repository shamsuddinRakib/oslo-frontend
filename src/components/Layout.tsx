import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, Heart, LogOut, Home as HomeIcon, Grid, ShoppingBag, Facebook } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import { useSettings } from "@/src/context/SettingsContext";
import ReactPixel from 'react-facebook-pixel';

export function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-wide">
            {settings?.logo && (
              <img src={settings.logo} alt={settings?.website_name || "OSLO BD"} className="h-8 object-contain" />
            )}
            <span className="font-bold text-lg uppercase tracking-tight">{settings?.website_name || "OSLO BD"}</span>
          </Link>
          <div className="hidden md:flex gap-4">
            <Link to="/" className="text-sm font-medium hover:underline">Home</Link>
            <Link to="/shop" className="text-sm font-medium hover:underline">Shop</Link>
            <Link to="/categories" className="text-sm font-medium hover:underline">Categories</Link>
            <Link to="/about" className="text-sm font-medium hover:underline">About</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSubmit} className="hidden md:flex relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2">
            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to={user.role === "admin" ? "/admin" : "/profile"}>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8 px-3">
                  <form onSubmit={()=>{
                    ReactPixel.track('Search', {
                      search_term: search,
                    });
                    handleSubmit}} className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground mt-2" />
                    <Input
                      placeholder="Search products..."
                      className="pl-7 py-1 mt-3"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </form>
                  <Link to="/" className="text-lg font-medium">Home</Link>
                  <Link to="/shop" className="text-lg font-medium">Shop</Link>
                  <Link to="/categories" className="text-lg font-medium">Categories</Link>
                  <Link to="/about" className="text-lg font-medium">About</Link>
                  <Link to="/wishlist" className="text-lg font-medium">Wishlist</Link>
                  <Link to="/profile" className="text-lg font-medium">Profile</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="border-t py-12 bg-muted/30">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            {settings?.logo && (
              <img src={settings.logo} alt={settings?.website_name || "OSLO BD"} className="h-8 object-contain grayscale hover:grayscale-0 transition-all" />
            )}
            <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">{settings?.website_name || "OSLO BD"}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">Quality Gear Quality Life.</p>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="#">FAQ</Link></li>
            <li><Link to="#">Shipping</Link></li>
            <li><Link to="#">Returns</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider">Contact</h4>
          {settings?.email && <p className="text-sm text-muted-foreground">{settings.email}</p>}
          {settings?.phone && <p className="text-sm text-muted-foreground">{settings.phone}</p>}
          {settings?.address && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{settings.address}</p>}
          {(!settings?.email && !settings?.phone && !settings?.address) && <p className="text-sm text-muted-foreground">hello@minimal.com</p>}
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} {settings?.website_name || "OSLO BD"}. All rights reserved.</span>
        {settings?.facebook_page && (
          <a href={settings.facebook_page} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Facebook className="h-7 w-7 bg-gray-600 text-white fill-current font- p-1 rounded-full hover:bg-blue-500" /></a>
        )}
      </div>
    </footer>
  );
}

export function MobileNavDock() {
  const location = useLocation();
  const { cart } = useCart();
  
  const navItems = [
    { name: "Home", path: "/", icon: <HomeIcon className="h-5 w-5" /> },
    { name: "Shop", path: "/shop", icon: <ShoppingBag className="h-5 w-5" /> },
    { name: "Categories", path: "/categories", icon: <Grid className="h-5 w-5" /> },
    { name: "Cart", path: "/cart", icon: <div className="relative">
      <ShoppingCart className="h-5 w-5" />
      {cart.length > 0 && (
        <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {cart.length}
        </span>
      )}
    </div> },
    { name: "Profile", path: "/profile", icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-background border-t pb-safe md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        // Use exact match for home, startsWith for others
        const isActive = item.path === "/" 
          ? location.pathname === "/" 
          : location.pathname.startsWith(item.path);
          
        return (
          <Link 
            key={item.name} 
            to={item.path} 
            className={`flex flex-col items-center justify-center w-full py-3 space-y-1 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
