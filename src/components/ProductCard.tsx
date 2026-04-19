import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { useCart } from "@/src/context/CartContext";
import { useWishlist } from "@/src/context/WishlistContext";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

interface ProductCardProps {
  key?: string | number;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Card className="group overflow-hidden border-none shadow-none hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </Link>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm z-10 transition-colors",
            isWishlisted ? "text-red-500" : "text-muted-foreground"
          )}
          onClick={handleWishlist}
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
        </Button>
      </div>
      <CardContent className="pt-4 px-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
      </CardContent>
      <CardFooter className="pb-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">${product.price.toFixed(2)}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <Button
          size="icon"
          className="h-8 w-8 rounded-md bg-slate-900 text-slate-50 hover:bg-slate-800 shrink-0"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
