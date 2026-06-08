import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { api } from "@/src/lib/api";
import { Package, ShoppingBag, Clock, CheckCircle2, Truck, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [reports, setReports] = useState<any>(null);

  useEffect(() => {
    api.getReports().then(setReports);
  }, []);

  if (!reports) return <div>Loading...</div>;

  const stats = [
    { label: "Total Products", value: reports.totalProducts, icon: Package, color: "text-blue-600" },
    { label: "Total Orders", value: reports.totalOrders, icon: ShoppingBag, color: "text-purple-600" },
    { label: "Pending", value: reports.statusCounts.pending, icon: Clock, color: "text-orange-600" },
    { label: "Shipped", value: reports.statusCounts.shipped, icon: Truck, color: "text-blue-400" },
    { label: "Delivered", value: reports.statusCounts.delivered, icon: CheckCircle2, color: "text-green-600" },
    { label: "Total Sales", value: `৳${reports.totalSales.toFixed(2)}`, icon: BarChart3, color: "text-emerald-600" },
  ];

  const chartData = [
    { name: "Pending", count: reports.statusCounts.pending },
    { name: "Shipped", count: reports.statusCounts.shipped },
    { name: "Delivered", count: reports.statusCounts.delivered },
    { name: "Cancelled", count: reports.statusCounts.cancelled },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">No recent activity to display.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
