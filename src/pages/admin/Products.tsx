import React, { useEffect, useState, useRef } from "react";
import { api, SERVER_URL } from "@/src/lib/api";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { Plus, Pencil, Trash2, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [thumbPreview, setThumbPreview] = useState<string>("");
  const [imagesList, setImagesList] = useState<{file: File | null, preview: string}[]>([]);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const [mrp, setMrp] = useState<number | "">("");
  const [discountType, setDiscountType] = useState<string>("flat");
  const [discount, setDiscount] = useState<number | "">("");
  const [currentPrice, setCurrentPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setThumbPreview(editingProduct.thumb_image || "");
      setImagesList((editingProduct.images || []).map((url: string) => ({ file: null, preview: url })));
      setMrp(editingProduct.originalPrice || "");
      setDiscountType(editingProduct.discount_type || "flat");
      setDiscount(editingProduct.discount || "");
      setCurrentPrice(editingProduct.price || "");
      setStock(editingProduct.stock || 0);
    } else {
      setThumbPreview("");
      setImagesList([]);
      setMrp("");
      setDiscountType("flat");
      setDiscount("");
      setCurrentPrice("");
      setStock("");
    }
  }, [editingProduct]);

  useEffect(() => {
    if (mrp !== "") {
      const mrpVal = Number(mrp);
      if (discount !== "") {
        const discVal = Number(discount);
        if (discountType === "percentage") {
          setCurrentPrice(Math.max(0, mrpVal - (mrpVal * discVal / 100)));
        } else {
          setCurrentPrice(Math.max(0, mrpVal - discVal));
        }
      } else {
        setCurrentPrice(mrpVal);
      }
    } else {
      setCurrentPrice("");
    }
  }, [mrp, discount, discountType]);

  const fetchData = async () => {
    const [p, c] = await Promise.all([api.getProducts(), api.getCategories()]);
    setProducts(p);
    setCategories(c);
  };

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setThumbPreview(URL.createObjectURL(files[0]));
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newItems = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImagesList(prev => [...prev, ...newItems]);
    }
    if (imagesInputRef.current) {
      imagesInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = new FormData();
    
    // Map form fields to API expected fields
    data.append("name", form.get("name") as string);
    data.append("description", form.get("description") as string);
    data.append("category_id", form.get("category_id") as string);
    data.append("current_price", currentPrice.toString());
    data.append("mrp_price", mrp.toString());
    data.append("discount_type", discountType);
    data.append("discount", discount.toString());
    data.append("stock", stock.toString());
    
    // Thumbnail image
    if (thumbInputRef.current?.files?.[0]) {
      data.append("thumb_image", thumbInputRef.current.files[0]);
    }
    
    // More images
    imagesList.forEach(item => {
      if (item.file) {
        data.append("images[]", item.file);
      }
    });

    try {
      if (editingProduct) {
       const res = await api.updateProduct(editingProduct.id, data);
       if(res.ok){
        toast.success("Product updated");
       }else{
        toast.error("Failed to update product");
       }
      } else {
        const res = await api.createProduct(data);
        if(res.ok){
          toast.success("Product created");
        }else{
          toast.error("Failed to create product");
        }
      }
      setIsAddOpen(false);
      setEditingProduct(null);
      setThumbPreview("");
      setImagesList([]);
      fetchData();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await api.deleteProduct(id);
      toast.success("Product deleted");
      fetchData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button onClick={() => {
          setEditingProduct(null);
          setIsAddOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>

        <Dialog open={isAddOpen} onOpenChange={(open) => {
          setIsAddOpen(open);
          if (!open) {
            setEditingProduct(null);
            setThumbPreview("");
            setImagesList([]);
          }
        }}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" defaultValue={editingProduct?.name} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="mrp">MRP (৳)</Label>
                  <Input id="mrp" name="originalPrice" type="number"  value={mrp} onChange={(e) => setMrp(e.target.value ? Number(e.target.value) : "")} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <Select name="discount_type" value={discountType} onValueChange={setDiscountType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat Amount</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                    </SelectContent>
                  </Select> 
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="discount">Discount</Label>
                  <Input id="discount" name="discount" type="number" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value ? Number(e.target.value) : "")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Current Price (৳)</Label>
                  <Input id="price" name="price" type="number" step="0.01" value={currentPrice !== "" ? Number(currentPrice).toFixed(2) : ""} readOnly className="bg-muted" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" name="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value ? Number(e.target.value) : "")} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category_id">Category</Label>
                <Select name="category_id" defaultValue={editingProduct?.category_id || ""} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label>Thumbnail Image</Label>
                <div className="grid grid-cols-4 gap-4">
                  {thumbPreview && (
                    <div className="relative aspect-square rounded-lg border bg-muted overflow-hidden group">
                      <img src={thumbPreview} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbPreview("");
                          if (thumbInputRef.current) thumbInputRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {!thumbPreview && (
                    <button
                      type="button"
                      onClick={() => thumbInputRef.current?.click()}
                      className="aspect-square rounded-lg border border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
                    >
                      <Plus className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Thumb</span>
                    </button>
                  )}
                </div>
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbChange}
                />
              </div>

              <div className="grid gap-2">
                <Label>More Images</Label>
                <div className="grid grid-cols-4 gap-4">
                  {imagesList.map((item, index) => (
                    <div key={index} className="relative aspect-square rounded-lg border bg-muted overflow-hidden group">
                      <img src={item.preview} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagesList(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => imagesInputRef.current?.click()}
                    className="aspect-square rounded-lg border border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
                  >
                    <Plus className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add More</span>
                  </button>
                </div>
                <input
                  ref={imagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImagesChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  defaultValue={editingProduct?.description} 
                  placeholder="Enter detailed product description..."
                  className="min-h-[120px]"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="h-10 w-10 rounded bg-muted overflow-hidden">
                    <img src={product.thumb_image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </TableCell> 
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>৳{product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingProduct(product);
                    setIsAddOpen(true);
                  }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
