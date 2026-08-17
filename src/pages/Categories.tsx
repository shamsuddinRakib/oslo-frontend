import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/src/lib/api";
import { useDocumentTitle } from "@/src/hooks/useDocumentTitle";
import { Card, CardContent } from "@/src/components/ui/card";
import { ChevronRight, Loader2 } from "lucide-react";

export default function Categories() {
  useDocumentTitle("Categories");
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getCategories().then(setCategories).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Browse Categories</h1>
        <p className="text-muted-foreground text-lg">
          Explore our wide range of products across different categories.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category: any) => (
            <Link key={category.id} to={`/shop?category=${category.id}`}>
              <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-muted/30">
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={category.image_url || `https://picsum.photos/seed/${category.name}/800/450`}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-white text-3xl font-bold tracking-tight drop-shadow-md">
                      {category.name}
                    </h2>
                  </div>
                </div>
                <CardContent className="p-6 flex items-center justify-between bg-background">
                  <div className="space-y-1">
                    <p className="font-medium">Explore {category.name}</p>
                    <p className="text-sm text-muted-foreground">View all products in this category</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
          <p className="text-muted-foreground">No categories found yet.</p>
        </div>
      )}
    </div>
  );
}
