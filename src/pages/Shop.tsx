import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/src/components/ProductCard";
import { api } from "@/src/lib/api";
import { useDocumentTitle } from "@/src/hooks/useDocumentTitle";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Search, Loader2 } from "lucide-react";

export default function Shop() {
  useDocumentTitle("Shop");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("newest");

  const categoryFilter = searchParams.get("category");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null && q !== search) {
      setSearch(q);
    }
  }, [searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      let sortVal = sortBy;
      if (sortBy === "price-low") sortVal = "price_asc";
      if (sortBy === "price-high") sortVal = "price_desc";
      if (sortBy === "newest") sortVal = "latest";
      
      api.getProducts({
        category: categoryFilter || undefined,
        search: search || undefined,
        sort: sortVal
      })
      .then(setProducts)
      .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [categoryFilter, search, sortBy]);


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
              onChange={(e) => {
                setSearch(e.target.value);
                const params = new URLSearchParams(searchParams);
                if (e.target.value) {
                  params.set("q", e.target.value);
                } else {
                  params.delete("q");
                }
                setSearchParams(params);
              }}
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
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete("category");
                  setSearchParams(params);
                }}
                className={`block text-sm hover:underline ${!categoryFilter ? "font-bold text-primary" : "text-muted-foreground"}`}
              >
                All Categories
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("category", cat.id.toString());
                    setSearchParams(params);
                  }}
                  className={`block text-sm hover:underline ${categoryFilter === cat.id.toString() ? "font-bold text-primary" : "text-muted-foreground"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
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
