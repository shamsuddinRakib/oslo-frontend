const API_BASE = "https://api.oslobd.com/api";
export const SERVER_URL = "https://api.oslobd.com"; 

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  headers["Accept"] = "application/json";
  return headers;
};

const fixImageUrl = (url: string | null | undefined) => {
  if (!url) return "";
  // if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${SERVER_URL}/storage/${url}`;
};

export const api = {
  login: async (phone: string, password: string) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ phone, password }),
    }).then((res) => res.json());
    return res;
  },

  register: async (data: any) => {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json());
    return res;
  },

  logout: async () => {
    const res = await fetch(`${API_BASE}/logout`, {
      method: "GET",
      headers: getHeaders(),
    }).then((res) => res.json());
    return res;
  },

  updateAdminProfile: async (data: any) => {
    const res = await fetch(`${API_BASE}/update-admin-profile`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json());
    return res;
  },

  getProducts: async (params?: { category?: string, search?: string, sort?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.search) query.append("search", params.search);
    if (params?.sort) query.append("sort", params.sort);
    
    const queryString = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${API_BASE}/products${queryString}`, {
      headers: getHeaders(),
    }).then((res) => res.json());
    return (res.products || []).map((p: any) => ({
      ...p,
      id: p.id?.toString(),
      price: Number(p.current_price || p.mrp_price) || 0,
      originalPrice: Number(p.mrp_price || p.current_price) || 0,
      discount_type: p.discount_type || "flat",
      discount: Number(p.discount) || 0,
      stock: Number(p.stock) || 0,
      category: p.category?.name ,
      category_id: p.category_id?.toString() || p.category?.id?.toString() || "",
      thumb_image: fixImageUrl(p.thumb_image || p.image),
      images: p.images ? p.images.map((img: string) => fixImageUrl(img.image)) : [],
    }));
  },

  getProductById: async (id: string) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      headers: getHeaders(),
    }).then((res) => res.json());
    if (res.product) {
      const p = res.product;
      return {
        ...p,
        id: p.id?.toString(),
        price: Number(p.current_price || p.price) || 0,
        originalPrice: Number(p.mrp || p.originalPrice) || 0,
        discount_type: p.discount_type || "amount",
        discount: Number(p.discount) || 0,
        stock: Number(p.stock) || 0,
        category: p.category?.name || p.category_id || p.category || "Uncategorized",
        category_id: p.category_id?.toString() || p.category?.id?.toString() || "",
        thumb_image: fixImageUrl(p.thumb_image || p.image),
        images: p.images ? p.images.map(fixImageUrl) : [],
      };
    }
    return null;
  },

  createProduct: async (data: FormData) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: getHeaders(true),
      body: data,
    }).then((res) => res.json());
    return res;
  },

  updateProduct: async (id: string, data: FormData) => {
    data.append("_method", "PUT");
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "POST",
      headers: getHeaders(true),
      body: data,
    }).then((res) => res.json());
    return res;
  },

  deleteProduct: async (id: string) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => res.json());
    return res;
  },

  getCategories: async () => {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: getHeaders(),
    }).then((res) => res.json());
    return (res.categories || []).map((c: any) => ({
      ...c,
      id: c.id?.toString(),
      image_url: fixImageUrl(c.image_url || c.image),
    }));
  },

  getCategoryById: async (id: string) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      headers: getHeaders(),
    }).then((res) => res.json());
    if (res.category) {
      res.category.image = fixImageUrl(res.category.image);
      return res.category;
    }
    return null;
  },

  createCategory: async (data: FormData) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: getHeaders(true),
      body: data,
    }).then((res) => res.json());
    return res;
  },

  updateCategory: async (id: string, data: FormData) => {
    data.append("_method", "PUT");
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "POST",
      headers: getHeaders(true),
      body: data,
    }).then((res) => res.json());
    return res;
  },

  deleteCategory: async (id: string) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => res.json());
    return res;
  },

  getOrders: async () => {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getHeaders(),
    }).then((res) => res.json());
    return (res.orders || []).map((o: any) => ({
      ...o,
      id: o.id?.toString(),
      total: Number(o.total || 0),
    }));
  },
  getUserOrders: async () => {
    const res = await fetch(`${API_BASE}/user/orders`, {
      headers: getHeaders(),
    }).then((res) => res.json());
    return res.orders;
  },

  getOrderById: async (id: string) => {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: getHeaders(),
    }).then((res) => res.json());
    return res.order;
  },

  createOrder: async (data: any) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json());
    return res;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    }).then((res) => res.json());
    return res;
  },

  getReports: async () => {
    try {
      const res = await fetch(`${API_BASE}/reports`, {
        headers: getHeaders(),
      }).then((res) => res.json());
      
      if (res.ok && res.data) {
        return {
          ...res.data,
          totalSales: Number(res.data.totalSales) || 0,
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  getTrustedClients: async () => {
    const res = await fetch(`${API_BASE}/trusted-clients`, {
      headers: getHeaders(),
    }).then((res) => res.json());
    return (res.data || []).map((c: any) => ({
      ...c,
      id: c.id?.toString(),
      logo: fixImageUrl(c.logo),
    }));
  },

  getTrustedClientById: async (id: string) => {
    const res = await fetch(`${API_BASE}/trusted-clients/${id}`, {
      headers: getHeaders(),
    }).then((res) => res.json());
    if (res.data) {
      res.data.logo = fixImageUrl(res.data.logo);
      return res.data;
    }
    return null;
  },

  createTrustedClient: async (data: FormData) => {
    const res = await fetch(`${API_BASE}/trusted-clients`, {
      method: "POST",
      headers: getHeaders(true),
      body: data,
    }).then((res) => res.json());
    return res;
  },

  updateTrustedClient: async (id: string, data: FormData) => {
    data.append("_method", "PUT");
    const res = await fetch(`${API_BASE}/trusted-clients/${id}`, {
      method: "POST",
      headers: getHeaders(true),
      body: data,
    }).then((res) => res.json());
    return res;
  },

  deleteTrustedClient: async (id: string) => {
    const res = await fetch(`${API_BASE}/trusted-clients/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => res.json());
    return res;
  },

  getWebsiteSettings: async () => {
    const res = await fetch(`${API_BASE}/website-settings/first`, {
      headers: getHeaders(),
    }).then((res) => res.json());
    if (res.data) {
      res.data.logo = fixImageUrl(res.data.logo);
      res.data.shipping_charge = Number(res.data.shipping_charge) || 0;
      return res.data;
    }
    return null;
  },

  getAllWebsiteSettings: async () => {
    const res = await fetch(`${API_BASE}/website-settings`, {
      headers: getHeaders(),
    }).then((res) => res.json());
    return (res.data || []).map((s: any) => ({
      ...s,
      logo: fixImageUrl(s.logo),
      shipping_charge: Number(s.shipping_charge) || 0,
    }));
  },

  createWebsiteSetting: async (data: FormData) => {
    const res = await fetch(`${API_BASE}/website-settings`, {
      method: "POST",
      headers: getHeaders(true),
      body: data,
    }).then((res) => res.json());
    return res;
  },

  updateWebsiteSetting: async (id: string, data: FormData) => {
    data.append("_method", "PUT");
    const res = await fetch(`${API_BASE}/website-settings/${id}`, {
      method: "POST",
      headers: getHeaders(true),
      body: data,
    }).then((res) => res.json());
    return res;
  },

  deleteWebsiteSetting: async (id: string) => {
    const res = await fetch(`${API_BASE}/website-settings/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => res.json());
    return res;
  },
};
