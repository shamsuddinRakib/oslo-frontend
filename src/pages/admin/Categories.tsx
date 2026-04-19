import React, { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await api.getCategories();
    setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await api.createCategory(formData);
      toast.success("Category created");
      setIsAddOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await api.deleteCategory(id);
      toast.success("Category deleted");
      fetchData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Category Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" required />
              </div>
              <Button type="submit" className="w-full">Create Category</Button>
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat: any) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <div className="h-10 w-10 rounded bg-muted overflow-hidden">
                    <img src={cat.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(cat.id)}>
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
