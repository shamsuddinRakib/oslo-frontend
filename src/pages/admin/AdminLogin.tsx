import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { toast } from "sonner";
import { useDocumentTitle } from "@/src/hooks/useDocumentTitle";

export default function AdminLogin() {
  useDocumentTitle("Admin Login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(phone, password);
      if (res.user.role !== "admin") {
        toast.error("You do not have admin access.");
        navigate("/");
        return;
      }
      toast.success(`Logged in as Admin`);
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold tracking-tight">Admin Portal</CardTitle>
          <CardDescription>Secure access for administrators only.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Admin Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01234567890"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-medium">Login to Dashboard</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
