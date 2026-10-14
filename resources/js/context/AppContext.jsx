import React, { createContext, useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";

export const AppContext = createContext(null);

// Send a request and resolve with { success, message } once Inertia is done.
function send(method, url, data = {}) {
  return new Promise((resolve) => {
    const options = {
      preserveScroll: true,
      preserveState: true,
      onSuccess: (page) =>
        resolve({ success: true, message: page.props.flash?.success || "Done." }),
      onError: (errors) =>
        resolve({
          success: false,
          message: errors.message || Object.values(errors)[0] || "Request failed.",
        }),
    };

    // router.delete(url, options) has no separate data argument.
    if (method === "delete") {
      router.delete(url, options);
    } else {
      router[method](url, data, options);
    }
  });
}

export function AppProvider({ children }) {
  const { auth, inventory } = usePage().props;

  const user = auth?.user ?? null;
  const {
    suppliers = [],
    locations = [],
    categories = [],
    products = [],
    batches = [],
    transactions = [],
    orders = [],
    notifications: serverNotifications = [],
    users = [],
    warehouseLocations: WAREHOUSE_LOCATIONS = [],
  } = inventory || {};

  // Keep a local copy of notifications so we can update it optimistically
  // when the user acknowledges or ignores an alert — without resetting the
  // filter dropdowns on the Alerts page (which would happen if preserveState
  // were set to false on the underlying send() helper).
  const [notifications, setNotifications] = useState(serverNotifications);

  // Sync local state whenever Inertia delivers fresh props (e.g. on navigation
  // or a full-page visit) so the list is never permanently stale.
  useEffect(() => {
    setNotifications(serverNotifications);
  }, [serverNotifications]);

  function logout() {
    router.post("/logout");
  }

  const getProductById = (id) => products.find((p) => p.ProductID === Number(id));
  const getCategoryById = (id) => categories.find((c) => c.CategoryID === Number(id));
  const getSupplierById = (id) => suppliers.find((s) => s.SuppliersID === Number(id));

  const getBatchesByProduct = (id) =>
    batches
      .filter((b) => b.ProductID === Number(id))
      .sort((a, b) => new Date(a.PurchaseDate) - new Date(b.PurchaseDate));

  const getActiveBatchesByProduct = (id) =>
    getBatchesByProduct(id).filter((b) => b.Status === "active" && b.RemainingStock > 0);

  function getStockStatus(product) {
    if (!product) return "OK";
    if (product.CurrentStock < product.SafetyStock) return "Critical";
    if (product.CurrentStock <= product.ReorderStock) return "Low Stock";
    if (product.CurrentStock > product.MaxStock) return "Overstock";
    return "OK";
  }

  function getDaysOfSupply(productId) {
    const product = getProductById(productId);
    if (!product) return 0;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const totalSold = transactions
      .filter(
        (t) =>
          t.ProductID === Number(productId) &&
          t.TransactionType === "SALE" &&
          new Date(t.TransactionDate) >= cutoff
      )
      .reduce((sum, t) => sum + Number(t.Quantity), 0);
    const avgDailySales = Math.max(1, totalSold / 30);
    return Math.round(product.CurrentStock / avgDailySales);
  }

  const getPendingAlertCount = () =>
    notifications.filter((n) => n.Status === "Pending").length;

  const acknowledgeAlert = (id) => {
    // Optimistically mark the alert as Acknowledged so the tier list and
    // sidebar badge update immediately — no need to wait for the server.
    setNotifications((prev) =>
      prev.map((n) =>
        n.NotificationID === id ? { ...n, Status: "Acknowledged" } : n
      )
    );
    return send("patch", `/alerts/${id}`, { Status: "Acknowledged" });
  };

  const ignoreAlert = (id) => {
    // Optimistically mark the alert as Ignored.
    setNotifications((prev) =>
      prev.map((n) =>
        n.NotificationID === id ? { ...n, Status: "Ignored" } : n
      )
    );
    return send("patch", `/alerts/${id}`, { Status: "Ignored" });
  };

  const addProduct = (data) => send("post", "/products", data);
  const updateProduct = (id, data) => send("put", `/products/${id}`, data);

  const addTransaction = (data) => send("post", "/transactions", data);

  const addSupplier = (data) => send("post", "/suppliers", data);
  const updateSupplier = (id, data) => send("put", `/suppliers/${id}`, data);
  const deleteSupplier = (id) => send("delete", `/suppliers/${id}`);

  const addLocation = (data) => send("post", "/locations", data);
  const updateLocation = (id, data) => send("put", `/locations/${id}`, data);
  const deleteLocation = (id) => send("delete", `/locations/${id}`);

  const addOrder = (data) => send("post", "/orders", data);
  const updateOrderStatus = (id, status) =>
    send("patch", `/orders/${id}/status`, { Status: status });

  const value = {
    user,
    users,
    suppliers,
    locations,
    categories,
    products,
    batches,
    transactions,
    orders,
    notifications,
    WAREHOUSE_LOCATIONS,

    logout,

    addTransaction,
    addProduct,
    updateProduct,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addLocation,
    updateLocation,
    deleteLocation,
    addOrder,
    updateOrderStatus,
    acknowledgeAlert,
    ignoreAlert,

    getProductById,
    getCategoryById,
    getSupplierById,
    getBatchesByProduct,
    getActiveBatchesByProduct,
    getStockStatus,
    getDaysOfSupply,
    getPendingAlertCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}