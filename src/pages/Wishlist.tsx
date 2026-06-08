import { ProductCard } from "@/src/components/ProductCard";
import { useWishlist } from "@/src/context/WishlistContext";
import { useDocumentTitle } from "@/src/hooks/useDocumentTitle";

export default function Wishlist() {
  useDocumentTitle("My Wishlist");
  const { wishlist } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Wishlist</h1>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishlist.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-xl">
          <p className="text-muted-foreground">Your wishlist is empty.</p>
        </div>
      )}
    </div>
  );
}
