import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, Heart, LogOut } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";

export function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
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
          <Link to="/" className="text-xl font-bold tracking-tighter">MINIMAL</Link>
          <div className="hidden md:flex gap-4">
            <Link to="/shop" className="text-sm font-medium hover:underline">Shop</Link>
            <Link to="/categories" className="text-sm font-medium hover:underline">Categories</Link>
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
                <div className="flex flex-col gap-4 mt-8">
                  <form onSubmit={handleSubmit} className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </form>
                  <Link to="/shop" className="text-lg font-medium">Shop</Link>
                  <Link to="/categories" className="text-lg font-medium">Categories</Link>
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
  return (
    <footer className="border-t py-12 bg-muted/30">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold">MINIMAL</h3>
          <p className="text-sm text-muted-foreground">Modern, minimalistic e-commerce experience.</p>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/featured">Featured</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/shipping">Shipping</Link></li>
            <li><Link to="/returns">Returns</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider">Contact</h4>
          <p className="text-sm text-muted-foreground">hello@minimal.com</p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
        © 2026 MINIMAL. All rights reserved.
      </div>
    </footer>
  );
}
