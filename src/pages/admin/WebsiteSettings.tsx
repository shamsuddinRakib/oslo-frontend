import React, { useEffect, useState, useRef } from "react";
import { api } from "@/src/lib/api";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/card";
import { toast } from "sonner";
import { X } from "lucide-react";
import { SERVER_URL,IMAGE_URL } from "@/service/api";

export default function AdminWebsiteSettings() {
  const [setting, setSetting] = useState<any>(null);
  const [preview, setPreview] = useState<string>("");
  const [previewSlider1, setPreviewSlider1] = useState<string>("");
  const [previewSlider2, setPreviewSlider2] = useState<string>("");
  const [previewSlider3, setPreviewSlider3] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefSlider1 = useRef<HTMLInputElement>(null);
  const fileInputRefSlider2 = useRef<HTMLInputElement>(null);
  const fileInputRefSlider3 = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await api.getWebsiteSettings();
    if (data) {
      setSetting(data);
      if (data.logo) {
        setPreview(data.logo);
      }
      if (data.slider_image1) setPreviewSlider1(data.slider_image1);
      if (data.slider_image2) setPreviewSlider2(data.slider_image2);
      if (data.slider_image3) setPreviewSlider3(data.slider_image3);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };
  const handleSlider1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewSlider1(URL.createObjectURL(file));
  };
  const handleSlider2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewSlider2(URL.createObjectURL(file));
  };
  const handleSlider3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewSlider3(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (setting && setting.id) {
        const res = await api.updateWebsiteSetting(setting.id, formData);
        if (res.status) {
          toast.success("Website settings updated successfully");
        } else {
          toast.error("Failed to update settings");
        }
      } else {
        const res = await api.createWebsiteSetting(formData);
        if (res.status) {
          toast.success("Website settings created successfully");
        } else {
          toast.error("Failed to create settings");
        }
      }
      fetchData();
    } catch (error) {
      toast.error("An error occurred while saving settings");
    } finally {
      setLoading(false);
    }
  };

  if (!setting && loading) {
    return <div>Loading...</div>;
  }

  // Use a key based on setting ID to force form re-render when data loads
  const formKey = setting?.id || "new";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Website Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
          <CardDescription>Manage your website's global configuration, contact details, and branding.</CardDescription>
        </CardHeader>
        <form key={formKey} onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="website_name">Website Name</Label>
                <Input id="website_name" name="website_name" defaultValue={setting?.website_name || ""} placeholder="MINIMAL" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input id="website_url" name="website_url" type="url" defaultValue={setting?.website_url || ""} placeholder="https://example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" defaultValue={setting?.phone || ""} placeholder="+8801XXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" defaultValue={setting?.email || ""} placeholder="hello@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook_page">Facebook Page URL</Label>
                <Input id="facebook_page" name="facebook_page" type="url" defaultValue={setting?.facebook_page || ""} placeholder="https://facebook.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_charge">Shipping Charge (৳)</Label>
                <Input id="shipping_charge" name="shipping_charge" type="number" step="0.01" defaultValue={setting?.shipping_charge || 0} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" defaultValue={setting?.address || ""} placeholder="123 Commerce St..." />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="logo">Website Logo</Label>
                <div className="flex items-start gap-4">
                  {preview && (
                    <div className="relative h-24 w-24 rounded border overflow-hidden group bg-muted shrink-0 flex items-center justify-center p-2">
                      <img src={IMAGE_URL + '/' + preview} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview("");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <Input 
                      ref={fileInputRef}
                      id="logo" 
                      name="logo" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Recommended: PNG or SVG, transparent background.</p>
                  </div>
                </div>
              </div>

              {/* Slider Images Section */}
              <div className="space-y-2 md:col-span-2 mt-4 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Homepage Slider Images</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Slider Image 1 */}
                  <div className="space-y-2">
                    <Label htmlFor="slider_image1">Slider Image 1</Label>
                    {previewSlider1 && (
                      <div className="relative h-32 w-full rounded border overflow-hidden group bg-muted flex items-center justify-center p-2 mb-2">
                        <img src={ IMAGE_URL+'/' + previewSlider1} alt="Slider 1 Preview" className="max-h-full max-w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewSlider1("");
                            if (fileInputRefSlider1.current) fileInputRefSlider1.current.value = "";
                          }}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    )}
                    <Input 
                      ref={fileInputRefSlider1} id="slider_image1" name="slider_image1" type="file" accept="image/*" 
                      onChange={handleSlider1Change} className="cursor-pointer"
                    />
                  </div>
                  
                  {/* Slider Image 2 */}
                  <div className="space-y-2">
                    <Label htmlFor="slider_image2">Slider Image 2</Label>
                    {previewSlider2 && (
                      <div className="relative h-32 w-full rounded border overflow-hidden group bg-muted flex items-center justify-center p-2 mb-2">
                        <img src={ IMAGE_URL+'/' + previewSlider2} alt="Slider 2 Preview" className="max-h-full max-w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewSlider2("");
                            if (fileInputRefSlider2.current) fileInputRefSlider2.current.value = "";
                          }}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    )}
                    <Input 
                      ref={fileInputRefSlider2} id="slider_image2" name="slider_image2" type="file" accept="image/*" 
                      onChange={handleSlider2Change} className="cursor-pointer"
                    />
                  </div>

                  {/* Slider Image 3 */}
                  <div className="space-y-2">
                    <Label htmlFor="slider_image3">Slider Image 3</Label>
                    {previewSlider3 && (
                      <div className="relative h-32 w-full rounded border overflow-hidden group bg-muted flex items-center justify-center p-2 mb-2">
                        <img src={ IMAGE_URL+'/' + previewSlider3} alt="Slider 3 Preview" className="max-h-full max-w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewSlider3("");
                            if (fileInputRefSlider3.current) fileInputRefSlider3.current.value = "";
                          }}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    )}
                    <Input 
                      ref={fileInputRefSlider3} id="slider_image3" name="slider_image3" type="file" accept="image/*" 
                      onChange={handleSlider3Change} className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
