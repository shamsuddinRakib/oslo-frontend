import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { format } from "date-fns";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { IMAGE_URL } from "@/service/api";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getOrderById(id).then((data) => {
        if (data && !data.error) {
          setOrder(data);
        } else {
          setOrder(null);
        }
        setLoading(false);
      }).catch(() => {
        setOrder(null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="container mx-auto py-20 text-center">Loading order details...</div>;
  if (!order) return <div className="container mx-auto py-20 text-center">Order not found.</div>;

  const steps = ["pending", "shipped", "delivered"];
  const currentStepIndex = steps.indexOf(order.status);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-5 w-5 text-yellow-500" />;
      case "shipped": return <Truck className="h-5 w-5 text-blue-500" />;
      case "delivered": return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
      </div>

      {/* Order Tracker */}
      <Card className="border-none bg-muted/30">
        <CardContent className="pt-10 pb-8">
          <div className="relative flex justify-between max-w-2xl mx-auto">
            {/* Progress Line Background */}
            <div className="absolute top-5 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full" />
            
            {/* Active Progress Line */}
            <div 
              className="absolute top-5 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-700 rounded-full" 
              style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isActive = index === currentStepIndex;
              
              return (
                <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                    isCompleted ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-background border-muted text-muted-foreground",
                    isActive && "ring-4 ring-primary/20 scale-110"
                  )}>
                    {step === "pending" && <Clock className="h-5 w-5" />}
                    {step === "shipped" && <Truck className="h-5 w-5" />}
                    {step === "delivered" && <CheckCircle className="h-5 w-5" />}
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "text-xs font-bold uppercase tracking-widest",
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step}
                    </p>
                    {isActive && (
                      <p className="text-[10px] text-primary font-medium mt-0.5">Current Stage</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Order #{order.order_id}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Placed on {order.created_at ? format(new Date(order.created_at), "PPP p") : "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                  {order.status?.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold">Items</h3>
                <div className="space-y-4">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-16 w-16 rounded bg-muted overflow-hidden flex-shrink-0">
                        <img src={IMAGE_URL +'/'+ item.product_image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 flex justify-between">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">৳ {(item.product_price * parseInt(item.quantity)).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳ {parseFloat(order.subtotal_amount)?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>৳ {parseFloat(order.shipping_charge)?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>৳ {parseFloat(order.total_amount)?.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-medium">{order.user_name}</p>
              <p className="text-muted-foreground">{order.shipping_address}</p>
              {/* <p className="text-muted-foreground">{order.customer?.city}, {order.customer?.zip}</p> */}
              <p className="text-muted-foreground">{order.user_phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-muted-foreground">Cash On Delivery</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
