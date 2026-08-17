import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw, Loader2, CloudLightning, Zap } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { ProductCard } from "@/src/components/ProductCard";
import { api } from "@/src/lib/api";
import { useDocumentTitle } from "@/src/hooks/useDocumentTitle";
import { useSettings } from "@/src/context/SettingsContext";
import { motion, AnimatePresence } from "motion/react";
import { IMAGE_URL } from "@/service/api";

export default function Home() {
  useDocumentTitle("Home");
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trustedClients, setTrustedClients] = useState([]);
  const [currentHero, setCurrentHero] = useState(0);

  const [loading, setLoading] = useState(true);

  const heroImages = [
    IMAGE_URL + '/' + settings?.slider_image1,
    IMAGE_URL + '/' + settings?.slider_image2,
    IMAGE_URL + '/' + settings?.slider_image3,
  ].filter(Boolean);

  if (heroImages.length === 0) {
    heroImages.push(
      "https://picsum.photos/seed/minimal/800/1000",
      "https://picsum.photos/seed/fashion/800/1000",
      "https://picsum.photos/seed/interior/800/1000"
    );
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getProducts().then(setProducts),
      api.getCategories().then(setCategories),
      api.getTrustedClients().then(setTrustedClients)
    ]).finally(() => setLoading(false));

    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="space-y-16 pb-16">
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}
      {/* Hero Section */}
      <section className="relative w-full mb-8 md:mb-0">
        {/* Mobile View */}
        <div className="relative w-full md:hidden aspect-[4/5] sm:aspect-[16/9] flex items-end justify-center pb-12 overflow-hidden bg-muted">
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentHero}
                src={heroImages[currentHero]}
                alt="Hero Mobile"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 w-full flex flex-col items-center gap-6 px-4">
            <Link to="/shop">
              <Button size="lg" className="px-10 rounded-full shadow-xl bg-primary text-primary-foreground font-bold border-2 border-white/20 hover:scale-105 transition-transform">Explore Now</Button>
            </Link>
            
            {/* Carousel Indicators for Mobile */}
            <div className="flex gap-2">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHero(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentHero === idx ? "w-8 bg-white" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid container mx-auto px-4 grid-cols-2 gap-8 items-center relative z-10 min-h-[600px] py-12">
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">New Collection 2026</p>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1]">
              QUALITY GEAR <br /> QUALITY LIFE
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
            
            {/* Carousel Indicators for Desktop */}
            <div className="flex gap-2 pt-4">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHero(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentHero === idx ? "w-8 bg-primary" : "w-2 bg-primary/20"
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="relative h-[500px] lg:h-[600px] w-full">
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
                  src={heroImages[currentHero]}
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
            <Link key={cat.id} to={`/shop?category=${cat.id}`} className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
              <img
                src={cat.image_url}
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

      {/* New Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
            <p className="text-muted-foreground">Check out our latest additions.</p>
          </div>
          <Link to="/shop" className="text-sm font-medium flex items-center gap-1 hover:underline">
            Shop All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...products].reverse().slice(0, 8).map((product: any) => (
            <ProductCard key={`new-${product.id}`} product={product} />
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

      {/* Trusted Clients */}
      {trustedClients.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Trusted By</h2>
            <p className="text-muted-foreground mt-2">Companies that trust our products.</p>
          </div>
          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 25s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}
          </style>
          <div className="overflow-hidden relative w-full">
            {/* We duplicate the list to create a seamless infinite loop */}
            <div className="flex animate-marquee whitespace-nowrap w-max gap-16 items-center">
              {[...trustedClients, ...trustedClients, ...trustedClients, ...trustedClients].map((client: any, idx: number) => (
                <div key={`${client.id}-${idx}`} className="flex flex-col items-center gap-3 w-[150px] shrink-0">
                  <div className="h-16 flex items-center justify-center">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="max-h-full max-w-full object-contain transition-all duration-300"
                    />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground whitespace-normal text-center">{client.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
              <Truck className="h-6 w-6" />
            </div>
            <h4 className="font-bold">Free Shipping</h4>
            <p className="text-sm text-muted-foreground">On all orders over ৳ 1000</p> 
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
              <Zap className="h-6 w-6" />
            </div>
            <h4 className="font-bold">Fast Delivery</h4>
            <p className="text-sm text-muted-foreground">Nation Wide Delivery within 3-4 days</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-bold">Secure Payment</h4>
            <p className="text-sm text-muted-foreground">100% secure with Cash on Delivery</p>
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
