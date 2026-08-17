import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/src/lib/api";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { Printer } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await api.getOrders();
    setOrders(data);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.updateOrderStatus(id, status);
      toast.success("Order status updated");
      fetchData();
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <div className="w-72">
          <Input 
            placeholder="Search by Order ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.filter((order: any) => 
              order.order_id?.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((order: any) => (
              <TableRow key={order.order_id}>
                <TableCell className="font-medium"># {order.order_id}</TableCell>
                <TableCell>{order.user_name || "N/A"}</TableCell>
                <TableCell>{format(new Date(order.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell>৳{order.total_amount}</TableCell>
                <TableCell>
                  <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                    {order.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                    View Details
                  </Button>
                  <Link to={`/admin/orders/${order.id}/invoice`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Printer className="h-4 w-4" />
                      Invoice
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Order Details: {selectedOrder?.order_id}</DialogTitle>
            {selectedOrder && (
              <Link to={`/admin/orders/${selectedOrder.id}/invoice`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Generate Invoice
                </Button>
              </Link>
            )}
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h3 className="font-bold text-sm uppercase text-muted-foreground">Customer</h3>
                  <p className="text-sm">{selectedOrder.user_name??'Guest'}</p>
                  <p className="text-sm">{selectedOrder.user_email??''}</p>
                  <p className="text-sm">{selectedOrder.user_phone??''}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-sm uppercase text-muted-foreground">Shipping Address</h3>
                  <p className="text-sm">{selectedOrder.shipping_address??''}</p>
                  <p className="text-sm">{selectedOrder.customer?.city}, {selectedOrder.customer?.zip}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase text-muted-foreground">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                      <img src={item.product_image} alt={item.name} className="w-20 h-20 px-2 object-cover" />
                      <span>{item.product_name} x {item.quantity}</span>
                      </div>
                      <span>৳{(item.product_price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t flex justify-between font-bold">
                    <span>Total</span>
                    <span>৳{selectedOrder.total_amount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase text-muted-foreground">Change Status</h3>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(val) => handleStatusChange(selectedOrder.id, val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
