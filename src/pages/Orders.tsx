import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.getOrders().then((data) => {
      if (user) {
        setOrders(data.filter((o: any) => o.userId === user.id));
      } else {
        setOrders(data.filter((o: any) => o.userId === "guest"));
      }
    });
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Order History</h1>
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Placed on {format(new Date(order.createdAt), "PPP")}
                  </p>
                </div>
                <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                  {order.status.toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </p>
                  <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                </div>
                <Link to={`/orders/${order.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-xl">
          <p className="text-muted-foreground">No orders found.</p>
          <Link to="/shop">
            <Button className="mt-4">Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
