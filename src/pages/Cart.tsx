import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/context/CartContext";
import { Separator } from "@/src/components/ui/separator";
import { useDocumentTitle } from "@/src/hooks/useDocumentTitle";
import { useSettings } from "@/src/context/SettingsContext";
import ReactPixel from 'react-facebook-pixel';

export default function Cart() {
  useDocumentTitle("Cart");
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const { settings } = useSettings();
  const shippingCharge = settings?.shipping_charge ? (parseFloat(total) > 1000 ? 0 : settings?.shipping_charge) : 0;
  const grandTotal = total > 0 ? total + shippingCharge : 0; 

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Your cart is empty</h1>
        <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between text-base font-medium">
                  <h3>{item.name}</h3>
                  <p className="ml-4">৳{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.image)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.image)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeFromCart(item.id, item.image)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/30 rounded-xl p-6 h-fit space-y-6">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>৳{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className={shippingCharge === 0 ? "text-green-600 font-medium" : "font-medium"}>
                {shippingCharge === 0 ? "Free" : `৳${shippingCharge.toFixed(2)}`}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>৳{grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="block" >
            <Button className="w-full" size="lg" onClick={() => {
              ReactPixel.track('InitiateCheckout', {
                num_items: cart.length,
                value: grandTotal,
                currency: 'BDT',
              });
            }}>
              Checkout <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
