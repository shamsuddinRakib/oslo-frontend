import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import { useDocumentTitle } from "@/src/hooks/useDocumentTitle";
import { api } from "@/src/lib/api";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { toast } from "sonner";
import { useSettings } from "@/src/context/SettingsContext";
import ReactPixel from 'react-facebook-pixel';

export default function Checkout() {
  useDocumentTitle("Checkout");
  const { cart, total, clearCart } = useCart();
  const { settings } = useSettings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);
  
  const shippingCharge = settings?.shipping_charge ? (parseFloat(total) > 1000 ? 0 : settings?.shipping_charge) : 0;
  const grandTotal = total > 0 ? total + shippingCharge : 0; 

  const [formData, setFormData] = useState({
    email: user?.email || "",
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    zip: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const orderPayload = {
        user: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.zip}`,
        },
        items: cart.map(item => ({
          product_id: parseInt(item.id) || item.id, // Parse ID if possible
          quantity: item.quantity,
          image: item.image || ''
        })),
        total_amount: grandTotal,
        shipping_charge: shippingCharge,
      };

      const res = await api.createOrder(orderPayload);
      if (!res.ok) {
        throw new Error(res.message || "Failed to place order");
      }

      clearCart();
      toast.success("Order placed successfully!");
      
      if (user) {
        navigate("/orders");
      } else {
        setSuccessOrder(res.order);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Order Successful!</h1>
        <p className="text-muted-foreground mb-8 text-lg">Thank you for your purchase. Your order has been placed.</p>
        <Card className="text-left border-primary/20 shadow-lg">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="flex justify-between items-center">
              <span>Order #{successOrder.order_id}</span>
              <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full capitalize">{successOrder.status}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold">৳{successOrder.total_amount}</span>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Shipping Details</h3>
              <div className="space-y-1 text-muted-foreground">
                <p><span className="font-medium text-foreground">Name:</span> {successOrder.user_name}</p>
                <p><span className="font-medium text-foreground">Phone:</span> {successOrder.user_phone}</p>
                <p><span className="font-medium text-foreground">Address:</span> {successOrder.shipping_address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Shipping Information</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City/District</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zip">Postal Code (optional)</Label>
                  <Input
                    id="zip"
                    
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Payment Method</h2>
            <div className="p-4 border rounded-lg bg-muted/30">
              <p className="font-medium">Cash on Delivery (COD)</p>
              <p className="text-sm text-muted-foreground">Pay when you receive your order.</p>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}
            onClick={() => {
              ReactPixel.track('Purchase', {
                num_items: cart.length,
                value: grandTotal,
                currency: 'BDT',
              });
            }}>
            {loading ? "Placing Order..." : `Place Order (৳${grandTotal.toFixed(2)})`}
          </Button>
        </form>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <img src={item.image} alt={item.name} className="w-20 h-20 px-2 object-cover" />
                  <span>{(item.name)} x {item.quantity}</span>
                  <p className='px-2 font-semibold'>৳{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="pt-4 flex justify-between text-sm">
                <span>Subtotal</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className={shippingCharge === 0 ? "text-green-600 font-medium" : "font-medium"}>
                  {shippingCharge === 0 ? "Free" : `৳${shippingCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-4 border-t flex justify-between font-bold">
                <span>Total</span>
                <span>৳{grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
