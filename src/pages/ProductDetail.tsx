import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Truck, ShieldCheck, RotateCcw, Loader2, Zap, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { api, SERVER_URL } from "@/src/lib/api";
import { useCart } from "@/src/context/CartContext";
import { useDocumentTitle } from "@/src/hooks/useDocumentTitle";
import { toast } from "sonner";
import { Separator } from "@/src/components/ui/separator";
import ReactPixel from 'react-facebook-pixel';
import { ProductCard } from "@/src/components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { addToCart } = useCart();
  useDocumentTitle(product ? product.name : "Product Details");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProducts().then((products) => {
      const found = products.find((p: any) => p.id === id);
      setProduct(found);
      if (found) {
        setSelectedImage(found.thumb_image);
        
        const related = products
          .filter((p: any) => p.category === found.category && p.id !== found.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    });
  }, [id]);

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container mx-auto py-32 flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) return <div className="container mx-auto py-20 text-center">Product not found.</div>;

  const images = product.images && product.images.length > 0 ? [product.thumb_image, ...product.images] : [product.thumb_image];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigate(-1)} className="hover:text-foreground flex items-center gap-1 mr-2 font-medium transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-border">|</span>
        <Link to="/" className="hover:text-foreground transition-colors ml-2">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-foreground transition-colors">{product.category}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-[300px]">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
            <img
              src={selectedImage || product.thumb_image}
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
                  className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === img ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
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

        <div className="space-y-8 mt-3">
         
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">{product.category}</p>
            <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-2xl font-bold">৳{product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-red-500 line-through ">
                  ৳ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
           <hr />
         

        

          <div className="flex gap-4">
            <Button size="lg" className="flex-1 gap-2 h-12" onClick={() => {
              addToCart(product);
              toast.success("Added to cart");
              ReactPixel.track('AddToCart', {
                content_name: product.name,
                value: product.price,
                currency: 'BDT',
              });
            }}>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="h-12 w-12 p-0">
              <Heart className="h-5 w-5 " />
            </Button>
          </div>

         

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-red-500" />
              <span className="text-red-500">Free shipping on orders over ৳ 1000</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Zap className="h-5 w-5 text-blue-500" />
              <span className="text-blue-500">Fast Delivery</span>
            </div>

              <p className="text-gray-700 leading-relaxed">
            {product.description || "Experience the perfect blend of style and functionality with our premium minimalist collection. Crafted with attention to detail and high-quality materials."}
          </p>
           
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Related Products</h2>
            <Link to={`/shop?category=${product.category}`} className="text-sm font-medium flex items-center gap-1 hover:underline">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
