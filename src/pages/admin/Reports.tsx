import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminReports() {
  const [reports, setReports] = useState<any>(null);

  useEffect(() => {
    api.getReports().then(setReports);
  }, []);

  if (!reports) return <div>Loading...</div>;

  // Mocking some historical data for the line chart
  const salesData = [
    { name: "Mon", sales: 1200 },
    { name: "Tue", sales: 1900 },
    { name: "Wed", sales: 1500 },
    { name: "Thu", sales: 2100 },
    { name: "Fri", sales: 2400 },
    { name: "Sat", sales: 3200 },
    { name: "Sun", sales: 2800 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Pending", count: reports.statusCounts.pending },
                { name: "Shipped", count: reports.statusCounts.shipped },
                { name: "Delivered", count: reports.statusCounts.delivered },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${reports.totalSales.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average Order Value</p>
              <p className="text-2xl font-bold">
                ${(reports.totalSales / (reports.totalOrders || 1)).toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{reports.totalOrders}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">3.2%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
