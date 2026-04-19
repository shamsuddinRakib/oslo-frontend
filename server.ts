import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import fs from "fs";

// Simple file-based DB
const DB_FILE = "db.json";
const UPLOADS_DIR = "public/uploads";

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const loadDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialDB = {
      products: [],
      categories: [],
      orders: [],
      users: [],
      wishlist: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
};

const saveDB = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/uploads", express.static(UPLOADS_DIR));

  // API Routes
  app.get("/api/products", (req, res) => {
    const db = loadDB();
    res.json(db.products);
  });

  app.post("/api/products", upload.array("images", 3), (req, res) => {
    const db = loadDB();
    const files = (req as any).files || [];
    const images = files.map((file: any) => `/uploads/${file.filename}`);
    
    const product = {
      ...req.body,
      id: Date.now().toString(),
      images: images.length > 0 ? images : [req.body.image],
      image: images.length > 0 ? images[0] : req.body.image,
      price: parseFloat(req.body.price),
      originalPrice: parseFloat(req.body.originalPrice),
    };
    db.products.push(product);
    saveDB(db);
    res.json(product);
  });

  app.put("/api/products/:id", upload.array("images", 3), (req, res) => {
    const db = loadDB();
    const index = db.products.findIndex((p: any) => p.id === req.params.id);
    if (index !== -1) {
      const files = (req as any).files || [];
      const newImages = files.map((file: any) => `/uploads/${file.filename}`);
      
      const updatedProduct = {
        ...db.products[index],
        ...req.body,
        price: parseFloat(req.body.price),
        originalPrice: parseFloat(req.body.originalPrice),
      };

      if (newImages.length > 0) {
        updatedProduct.images = newImages;
        updatedProduct.image = newImages[0];
      }

      db.products[index] = updatedProduct;
      saveDB(db);
      res.json(db.products[index]);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    const db = loadDB();
    db.products = db.products.filter((p: any) => p.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  app.get("/api/categories", (req, res) => {
    const db = loadDB();
    res.json(db.categories);
  });

  app.post("/api/categories", upload.single("image"), (req, res) => {
    const db = loadDB();
    const category = {
      ...req.body,
      id: Date.now().toString(),
      image: (req as any).file ? `/uploads/${(req as any).file.filename}` : req.body.image,
    };
    db.categories.push(category);
    saveDB(db);
    res.json(category);
  });

  app.delete("/api/categories/:id", (req, res) => {
    const db = loadDB();
    db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  app.get("/api/orders", (req, res) => {
    const db = loadDB();
    res.json(db.orders);
  });
  
  app.get("/api/orders/:id", (req, res) => {
    const db = loadDB();
    const order = db.orders.find((o: any) => o.id === req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });

  app.post("/api/orders", (req, res) => {
    const db = loadDB();
    const order = {
      ...req.body,
      id: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    db.orders.push(order);
    saveDB(db);
    res.json(order);
  });

  app.patch("/api/orders/:id/status", (req, res) => {
    const db = loadDB();
    const index = db.orders.findIndex((o: any) => o.id === req.params.id);
    if (index !== -1) {
      db.orders[index].status = req.body.status;
      saveDB(db);
      res.json(db.orders[index]);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });

  app.get("/api/reports", (req, res) => {
    const db = loadDB();
    const totalSales = db.orders.reduce((sum: number, o: any) => sum + o.total, 0);
    const totalOrders = db.orders.length;
    const totalProducts = db.products.length;
    const statusCounts = {
      pending: db.orders.filter((o: any) => o.status === "pending").length,
      shipped: db.orders.filter((o: any) => o.status === "shipped").length,
      delivered: db.orders.filter((o: any) => o.status === "delivered").length,
    };
    res.json({ totalSales, totalOrders, totalProducts, statusCounts });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
