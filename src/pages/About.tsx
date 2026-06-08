import React from "react";
import { useSettings } from "@/src/context/SettingsContext";
import { useDocumentTitle } from "@/src/hooks/useDocumentTitle";

export default function About() {
  useDocumentTitle("About Us");
  const { settings } = useSettings();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
        <p className="text-xl text-muted-foreground">
          Welcome to {settings?.website_name || "our store"}.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            We are dedicated to providing the best shopping experience for our customers. 
            At {settings?.website_name || "our store"}, we believe in quality, affordability, and 
            excellent customer service. Our carefully curated selection of products ensures that you 
            always find exactly what you're looking for.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Founded with a passion for minimalistic and modern design, our goal is to simplify your 
            life by offering premium items that stand the test of time.
          </p>
        </div>
        {settings?.logo ? (
          <div className="bg-muted/30 p-8 rounded-2xl flex items-center justify-center">
            <img 
              src={settings.logo} 
              alt={settings?.website_name || "Logo"} 
              className="max-h-64 object-contain"
            />
          </div>
        ) : (
          <div className="bg-muted/30 p-8 rounded-2xl h-64 flex items-center justify-center">
            <span className="text-3xl font-bold text-muted-foreground">{settings?.website_name || "MINIMAL"}</span>
          </div>
        )}
      </div>

      <div className="bg-muted/30 rounded-2xl p-8 md:p-12 text-center space-y-8">
        <h2 className="text-2xl font-bold tracking-tight">Get in Touch</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Email</h3>
            <p className="text-muted-foreground">{settings?.email || "hello@minimal.com"}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Phone</h3>
            <p className="text-muted-foreground">{settings?.phone || "+1 (555) 000-0000"}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Address</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {settings?.address || "123 Commerce St.\nNew York, NY 10001"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
