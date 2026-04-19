import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/src/components/ProductCard";
import { api } from "@/src/lib/api";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Search } from "lucide-react";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("newest");

  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    api.getProducts().then(setProducts);
    api.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  const filteredProducts = products
    .filter((p: any) => {
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Shop All</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-64 space-y-6">
          <div>
            <h3 className="font-bold mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSearchParams({})}
                className={`block text-sm hover:underline ${!categoryFilter ? "font-bold text-primary" : "text-muted-foreground"}`}
              >
                All Categories
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.name })}
                  className={`block text-sm hover:underline ${categoryFilter === cat.name ? "font-bold text-primary" : "text-muted-foreground"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-xl">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
