import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Heart, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { api } from "@/src/lib/api";
import { useCart } from "@/src/context/CartContext";
import { toast } from "sonner";
import { Separator } from "@/src/components/ui/separator";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { addToCart } = useCart();

  useEffect(() => {
    api.getProducts().then((products) => {
      const found = products.find((p: any) => p.id === id);
      setProduct(found);
      if (found) {
        setSelectedImage(found.image);
      }
    });
  }, [id]);

  if (!product) return <div className="container mx-auto py-20 text-center">Loading...</div>;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-all duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-4">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all ${selectedImage === img ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">{product.category}</p>
            <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description || "Experience the perfect blend of style and functionality with our premium minimalist collection. Crafted with attention to detail and high-quality materials."}
          </p>

          <div className="flex gap-4">
            <Button size="lg" className="flex-1 gap-2" onClick={() => {
              addToCart(product);
              toast.success("Added to cart");
            }}>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="h-12 w-12 p-0">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span>30-day easy return policy</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <span>2-year warranty included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
