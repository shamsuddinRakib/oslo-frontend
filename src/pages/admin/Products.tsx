import React, { useEffect, useState, useRef } from "react";
import { api } from "@/src/lib/api";
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
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      const images = editingProduct.images || (editingProduct.image ? [editingProduct.image] : []);
      setPreviews(images);
    } else {
      setPreviews([]);
    }
  }, [editingProduct]);

  const fetchData = async () => {
    const [p, c] = await Promise.all([api.getProducts(), api.getCategories()]);
    setProducts(p);
    setCategories(c);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, formData);
        toast.success("Product updated");
      } else {
        await api.createProduct(formData);
        toast.success("Product created");
      }
      setIsAddOpen(false);
      setEditingProduct(null);
      setPreviews([]);
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
        <Dialog open={isAddOpen} onOpenChange={(open) => {
          setIsAddOpen(open);
          if (!open) {
            setEditingProduct(null);
            setPreviews([]);
          }
        }}>
          <DialogTrigger render={<Button onClick={() => setEditingProduct(null)} />}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </DialogTrigger>
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
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="originalPrice">Original Price ($)</Label>
                  <Input id="originalPrice" name="originalPrice" type="number" step="0.01" defaultValue={editingProduct?.originalPrice} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={editingProduct?.category} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Product Images (Up to 3)</Label>
                <div className="grid grid-cols-3 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg border bg-muted overflow-hidden">
                      <img src={preview} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  {previews.length < 3 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
                    >
                      <Plus className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="text-[10px] text-muted-foreground">
                  First image will be the primary image.
                </p>
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
                    <img src={product.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
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
