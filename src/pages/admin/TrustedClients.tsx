import React, { useEffect, useState, useRef } from "react";
import { api } from "@/src/lib/api";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminTrustedClients() {
  const [clients, setClients] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await api.getTrustedClients();
    setClients(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      if (editingClient) {
        const res = await api.updateTrustedClient(editingClient.id, formData);
        if (res.status) {
          toast.success("Trusted client updated");
        } else {
          toast.error("Failed to update trusted client");
        }
      } else {
        const res = await api.createTrustedClient(formData);
        if (res.status) {
          toast.success("Trusted client created");
        } else {
          toast.error("Failed to create trusted client");
        }
      }
      setIsAddOpen(false);
      setEditingClient(null);
      setPreview("");
      fetchData();
    } catch (error) {
      toast.error(editingClient ? "Failed to update client" : "Failed to create client");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await api.deleteTrustedClient(id);
      toast.success("Trusted client deleted");
      fetchData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Trusted Clients</h1>
        <Button onClick={() => {
          setEditingClient(null);
          setPreview("");
          setIsAddOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>

        <Dialog open={isAddOpen} onOpenChange={(open) => {
          setIsAddOpen(open);
          if (!open) {
            setEditingClient(null);
            setPreview("");
          }
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Client Name</Label>
                <Input id="name" name="name" defaultValue={editingClient?.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logo">Client Logo</Label>
                {preview && (
                  <div className="relative h-20 w-20 rounded border overflow-hidden group bg-muted">
                    <img src={preview} alt="" className="h-full w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
                <Input 
                  ref={fileInputRef}
                  id="logo" 
                  name="logo" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  required={!editingClient} 
                />
              </div>
              <Button type="submit" className="w-full">
                {editingClient ? "Update Client" : "Create Client"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client: any) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="h-10 w-24 rounded bg-muted overflow-hidden flex items-center justify-center p-1">
                    <img src={client.logo} alt={client.name} className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                </TableCell> 
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingClient(client);
                    setPreview(client.logo);
                    setIsAddOpen(true);
                  }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(client.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No trusted clients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
