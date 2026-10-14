import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";
import { StatusBadge } from "../components/Badge";
import Modal from "../components/Modal";
import SearchSelect from "../components/SearchSelect";

const EMPTY_FORM = {
  ProductName: "",
  CategoryID: "",
  SuppliersID: "",
  UnitCost: "",
  SellingPrice: "",
  ReorderStock: "",
  SafetyStock: "",
  MaxStock: "",
  Seasonal: "no",
  Location: "",
};

export default function Products() {
  const {
    products,
    categories,
    suppliers,
    WAREHOUSE_LOCATIONS,
    addProduct,
    getCategoryById,
  } = useContext(AppContext);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  // Options for the type-to-search dropdowns in the Add Product form.
  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.CategoryID, label: c.CategoryName })),
    [categories]
  );
  const supplierOptions = useMemo(
    () => suppliers.map((s) => ({ value: s.SuppliersID, label: s.SupplierName })),
    [suppliers]
  );
  const locationOptions = useMemo(
    () => WAREHOUSE_LOCATIONS.map((loc) => ({ value: loc, label: loc })),
    [WAREHOUSE_LOCATIONS]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.ProductName.toLowerCase().includes(
        search.toLowerCase()
      );
      const matchesCategory =
        categoryFilter === "all" || p.CategoryID === Number(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setFormError("");

    if (!form.CategoryID || !form.SuppliersID || !form.Location) {
      setFormError("Please choose a category, supplier and location from the lists.");
      return;
    }

    const result = await addProduct({
      ProductName: form.ProductName,
      CategoryID: Number(form.CategoryID),
      SuppliersID: Number(form.SuppliersID),
      UnitCost: Number(form.UnitCost),
      SellingPrice: Number(form.SellingPrice),
      CurrentStock: 0,
      ReorderStock: Number(form.ReorderStock),
      SafetyStock: Number(form.SafetyStock),
      MaxStock: Number(form.MaxStock),
      Seasonal: form.Seasonal === "yes",
      Location: form.Location,
    });
    if (!result.success) {
      setFormError(result.message);
      return;
    }
    setForm(EMPTY_FORM);
    setModalOpen(false);
  }

  return (
    <div className="page">
      <div className="page-header-row">
        <h1 className="page-title">Products</h1>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + Add Product
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.CategoryID} value={c.CategoryID}>
              {c.CategoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Strategy</th>
                <th>Seasonal</th>
                <th>Current Stock</th>
                <th>Reorder Point</th>
                <th>Safety Stock</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={9} className="empty-cell">
                    No products match your filters.
                  </td>
                </tr>
              )}
              {filteredProducts.map((p) => {
                const category = getCategoryById(p.CategoryID);
                return (
                  <tr key={p.ProductID}>
                    <td>{p.ProductName}</td>
                    <td>{category ? category.CategoryName : "-"}</td>
                    <td>{category ? category.InventoryStrategy : "-"}</td>
                    <td>{p.Seasonal ? "Yes" : "No"}</td>
                    <td>{p.CurrentStock}</td>
                    <td>{p.ReorderStock}</td>
                    <td>{p.SafetyStock}</td>
                    <td>{p.Location}</td>
                    <td>
                      <StatusBadge
                        currentStock={p.CurrentStock}
                        reorderStock={p.ReorderStock}
                        safetyStock={p.SafetyStock}
                        maxStock={p.MaxStock}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Product"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" form="add-product-form" type="submit">
              Save Product
            </button>
          </>
        }
      >
        <form id="add-product-form" onSubmit={handleAddProduct} className="form-grid">
          {formError && <p className="login-error">{formError}</p>}
          <label>
            Product Name
            <input
              required
              type="text"
              value={form.ProductName}
              onChange={(e) => handleFormChange("ProductName", e.target.value)}
            />
          </label>

          <label>
            Category
            <SearchSelect
              options={categoryOptions}
              value={form.CategoryID}
              onChange={(v) => handleFormChange("CategoryID", v)}
              placeholder="Type to search category..."
            />
          </label>

          <label>
            Supplier
            <SearchSelect
              options={supplierOptions}
              value={form.SuppliersID}
              onChange={(v) => handleFormChange("SuppliersID", v)}
              placeholder="Type to search supplier..."
            />
          </label>

          <label>
            Unit Cost
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.UnitCost}
              onChange={(e) => handleFormChange("UnitCost", e.target.value)}
            />
          </label>

          <label>
            Selling Price
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.SellingPrice}
              onChange={(e) => handleFormChange("SellingPrice", e.target.value)}
            />
          </label>

          <label>
            Reorder Stock
            <input
              required
              type="number"
              min="0"
              value={form.ReorderStock}
              onChange={(e) => handleFormChange("ReorderStock", e.target.value)}
            />
          </label>

          <label>
            Safety Stock
            <input
              required
              type="number"
              min="0"
              value={form.SafetyStock}
              onChange={(e) => handleFormChange("SafetyStock", e.target.value)}
            />
          </label>

          <label>
            Max Stock
            <input
              required
              type="number"
              min="0"
              value={form.MaxStock}
              onChange={(e) => handleFormChange("MaxStock", e.target.value)}
            />
          </label>

          <label>
            Seasonal
            <select
              value={form.Seasonal}
              onChange={(e) => handleFormChange("Seasonal", e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>

          <label>
            Location
            <SearchSelect
              options={locationOptions}
              value={form.Location}
              onChange={(v) => handleFormChange("Location", v)}
              placeholder="Type to search location..."
            />
          </label>
        </form>
      </Modal>
    </div>
  );
}