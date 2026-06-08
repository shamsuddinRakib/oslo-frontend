import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SettingsProvider } from "./context/SettingsContext";
import { Toaster } from "@/src/components/ui/sonner";
import reactPixel from 'react-facebook-pixel';
import PixelTracker from "./components/PixelTracker.tsx";

reactPixel.init('25898857549789501');
reactPixel.pageView();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
     <PixelTracker />
      <SettingsProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
              <Toaster position="top-center" />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
);
