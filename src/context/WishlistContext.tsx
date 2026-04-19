import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface WishlistContextType {
  wishlist: any[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>(() => {
    const saved = localStorage.getItem(`wishlist_${user?.id || "guest"}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const key = `wishlist_${user?.id || "guest"}`;
    localStorage.setItem(key, JSON.stringify(wishlist));
  }, [wishlist, user]);

  // Reset wishlist when user changes (e.g. login/logout)
  useEffect(() => {
    const key = `wishlist_${user?.id || "guest"}`;
    const saved = localStorage.getItem(key);
    setWishlist(saved ? JSON.parse(saved) : []);
  }, [user]);

  const addToWishlist = (product: any) => {
    if (!user) {
      toast.error("Please login to add items to your wishlist");
      return;
    }
    if (!wishlist.find((p) => p.id === product.id)) {
      setWishlist([...wishlist, product]);
      toast.success("Added to wishlist");
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(wishlist.filter((p) => p.id !== productId));
    toast.success("Removed from wishlist");
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
