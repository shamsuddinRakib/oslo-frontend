import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/src/lib/api";
import { Button } from "@/src/components/ui/button";
import { format } from "date-fns";
import { Printer, ArrowLeft } from "lucide-react";
import { useSettings } from "@/src/context/SettingsContext";

export default function AdminInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    if (id) {
      api.getOrderById(id).then((data) => {
        setOrder(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handlePrint = () => {
    // Adding a small delay and focus to ensure the print dialog triggers correctly in iframe environments
    setTimeout(() => {
      window.focus();
      window.print();
    }, 100);
  };

  if (loading) return <div className="p-8 text-center">Loading invoice...</div>;
  if (!order) return <div className="p-8 text-center">Order not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
        <div className="flex items-center gap-4">
          <p className="text-xs text-muted-foreground hidden md:block">
            Tip: If the print dialog doesn't open, please open the app in a new tab.
          </p>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-8 print:border-0 print:shadow-none print:p-0">
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b pb-8 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">INVOICE</h1>
            <p className="text-muted-foreground">Order #{order.order_id}</p>
          </div>
          <div className="text-right space-y-1">
            <h2 className="font-bold text-xl">{settings?.website_name}</h2>
            <p className="text-sm text-muted-foreground">{settings?.email}</p>
            <p className="text-sm text-muted-foreground">{settings?.phone}</p>
            <p className="text-sm text-muted-foreground">{settings?.address}</p>
          </div>
        </div>

        {/* Billing & Shipping */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Bill To</h3>
            <div className="text-sm space-y-1">
              <p className="font-bold text-base">{order.user_name}</p>
              <p>{order.user_email}</p>
              <p>{order.user_phone}</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Ship To</h3>
            <div className="text-sm space-y-1">
              <p className="font-bold text-base">{order.user_name}</p>
              <p>{order.shipping_address}</p>
              <p>{order.user_city}, {order.user_zip}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-3 gap-8 mb-12 border-y py-6">
          <div>
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">Invoice Date</h3>
            <p className="text-sm font-medium">{format(new Date(order.created_at), "MMMM d, yyyy")}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">Payment Method</h3>
            <p className="text-sm font-medium">{order.payment_status || "Cash on Delivery"}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">Order Status</h3>
            <p className="text-sm font-medium uppercase">{order.status}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-b text-left text-xs font-bold uppercase text-muted-foreground">
              <th className="py-4">Item Description</th>
              <th className="py-4 text-center">Qty</th>
              <th className="py-4 text-right">Price</th>
              <th className="py-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {order.order_items?.map((item: any) => (
              <tr key={item.id} className="border-b">
                <td className="py-4">
                  <p className="font-medium">{item.product_name}</p>
                </td>
                <td className="py-4 text-center">{item.quantity}</td>
                <td className="py-4 text-right">৳{item.product_price}</td>
                <td className="py-4 text-right">৳{(item.product_price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>৳{order.subtotal_amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>৳{order.shipping_charge}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total</span>
              <span>৳{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t text-center space-y-2">
          <p className="text-sm font-medium">Thank you for your business!</p>
          <p className="text-xs text-muted-foreground">If you have any questions about this invoice, please contact us.</p>
        </div>
      </div>
    </div>
  );
}
