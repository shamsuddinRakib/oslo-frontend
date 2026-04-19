const API_BASE = "/api";

export const api = {
  getProducts: () => fetch(`${API_BASE}/products`).then((res) => res.json()),
  createProduct: (data: FormData) =>
    fetch(`${API_BASE}/products`, { method: "POST", body: data }).then((res) => res.json()),
  updateProduct: (id: string, data: FormData) =>
    fetch(`${API_BASE}/products/${id}`, { method: "PUT", body: data }).then((res) => res.json()),
  deleteProduct: (id: string) =>
    fetch(`${API_BASE}/products/${id}`, { method: "DELETE" }).then((res) => res.json()),

  getCategories: () => fetch(`${API_BASE}/categories`).then((res) => res.json()),
  createCategory: (data: FormData) =>
    fetch(`${API_BASE}/categories`, { method: "POST", body: data }).then((res) => res.json()),
  deleteCategory: (id: string) =>
    fetch(`${API_BASE}/categories/${id}`, { method: "DELETE" }).then((res) => res.json()),

  getOrders: () => fetch(`${API_BASE}/orders`).then((res) => res.json()),
  getOrderById: (id: string) => fetch(`${API_BASE}/orders/${id}`).then((res) => res.json()),
  createOrder: (data: any) =>
    fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  updateOrderStatus: (id: string, status: string) =>
    fetch(`${API_BASE}/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then((res) => res.json()),

  getReports: () => fetch(`${API_BASE}/reports`).then((res) => res.json()),
};
