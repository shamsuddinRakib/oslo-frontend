import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { ProductCard } from "@/src/components/ProductCard";
import { api } from "@/src/lib/api";
import { motion, AnimatePresence } from "motion/react";

const HERO_IMAGES = [
  "https://picsum.photos/seed/minimal/800/1000",
  "https://picsum.photos/seed/fashion/800/1000",
  "https://picsum.photos/seed/interior/800/1000",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    api.getProducts().then(setProducts);
    api.getCategories().then(setCategories);

    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-muted/30">
        {/* Mobile Background Image Carousel */}
        <div className="absolute inset-0 md:hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentHero}
              src={HERO_IMAGES[currentHero]}
              alt="Hero Mobile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/20 to-background/80" />
        </div>

        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">New Collection 2026</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
              ESSENTIAL <br /> MINIMALISM
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Discover our curated collection of high-quality essentials designed for modern living.
            </p>
            <div className="flex gap-4 pt-2">
              <Link to="/shop">
                <Button size="lg" className="px-8">Shop Now</Button>
              </Link>
              <Link to="/categories">
                <Button size="lg" variant="outline" className="px-8">Explore</Button>
              </Link>
            </div>

            {/* Carousel Indicators */}
            <div className="flex gap-2 pt-4">
              {HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHero(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${currentHero === idx ? "w-8 bg-primary" : "w-2 bg-primary/20"
                    }`}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:block relative h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img
                  src={HERO_IMAGES[currentHero]}
                  alt="Hero"
                  className="h-full w-full object-cover rounded-2xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground">Find exactly what you're looking for.</p>
          </div>
          <Link to="/categories" className="text-sm font-medium flex items-center gap-1 hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat: any) => (
            <Link key={cat.id} to={`/shop?category=${cat.name}`} className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white font-bold text-xl">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Popular Products</h2>
            <p className="text-muted-foreground">Our most loved items this week.</p>
          </div>
          <Link to="/shop" className="text-sm font-medium flex items-center gap-1 hover:underline">
            Shop All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
              <Truck className="h-6 w-6" />
            </div>
            <h4 className="font-bold">Free Shipping</h4>
            <p className="text-sm text-muted-foreground">On all orders over $100</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
              <RotateCcw className="h-6 w-6" />
            </div>
            <h4 className="font-bold">Easy Returns</h4>
            <p className="text-sm text-muted-foreground">30-day return policy</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-bold">Secure Payment</h4>
            <p className="text-sm text-muted-foreground">100% secure checkout</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h4 className="font-bold">Quality Assured</h4>
            <p className="text-sm text-muted-foreground">Handpicked premium items</p>
          </div>
        </div>
      </section>
    </div>
  );
}
