import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";
import { canRecordPurchases } from "../config/permissions";
import SearchSelect from "../components/SearchSelect";

const STOCK_IN_EMPTY = {
  ProductID: "",
  Quantity: "",
  PurchaseDate: new Date().toISOString().slice(0, 10),
  Location: "",
  PerformedBy: "",
  Notes: "",
  ExpirationDate: "",
};

const STOCK_OUT_EMPTY = {
  ProductID: "",
  TransactionType: "SALE",
  Quantity: "",
  PerformedBy: "",
  Notes: "",
};

export default function Transaction() {
  const { user } = useContext(AppContext);
  const canStockIn = canRecordPurchases(user?.Role);
  const [activeTab, setActiveTab] = useState(canStockIn ? "in" : "out");

  // If a role that can't stock in somehow lands on the "in" tab,
  // bump them to the tab they're allowed to use.
  useEffect(() => {
    if (!canStockIn && activeTab === "in") {
      setActiveTab("out");
    }
  }, [canStockIn, activeTab]);

  return (
    <div className="page">
      <h1 className="page-title">Transaction</h1>

      <div className="tabs">
        {canStockIn && (
          <button
            className={`tab-btn ${activeTab === "in" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("in")}
          >
            Stock In
          </button>
        )}
        <button
          className={`tab-btn ${activeTab === "out" ? "tab-btn-active" : ""}`}
          onClick={() => setActiveTab("out")}
        >
          Stock Out
        </button>
      </div>

      {activeTab === "in" && canStockIn ? <StockInForm /> : <StockOutForm />}
    </div>
  );
}

function StockInForm() {
  const { products, WAREHOUSE_LOCATIONS, addTransaction, getCategoryById } =
    useContext(AppContext);
  const [form, setForm] = useState(STOCK_IN_EMPTY);
  const [message, setMessage] = useState(null);

  const selectedProduct = products.find(
    (p) => p.ProductID === Number(form.ProductID)
  );
  const selectedCategory = selectedProduct
    ? getCategoryById(selectedProduct.CategoryID)
    : null;
  const isFifo = selectedCategory && selectedCategory.InventoryStrategy === "FIFO";

  const willExceedMax =
    selectedProduct &&
    form.Quantity &&
    selectedProduct.CurrentStock + Number(form.Quantity) > selectedProduct.MaxStock;

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!form.ProductID) {
      setMessage({ type: "error", text: "Please pick a product from the list." });
      return;
    }

    if (isFifo && !form.ExpirationDate) {
      setMessage({ type: "error", text: "Expiry Date is required for this product." });
      return;
    }

    const result = await addTransaction({
      ProductID: Number(form.ProductID),
      TransactionType: "PURCHASE",
      Quantity: Number(form.Quantity),
      TransactionDate: form.PurchaseDate,
      Location: form.Location,
      PerformedBy: form.PerformedBy,
      Notes: form.Notes,
      ExpirationDate: isFifo ? form.ExpirationDate : null,
    });

    if (result.success) {
      setMessage({ type: "success", text: "Stock in recorded successfully." });
      setForm(STOCK_IN_EMPTY);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  }

  return (
    <div className="panel">
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Product
          <SearchSelect
            placeholder="Type to search product..."
            value={form.ProductID}
            onChange={(val) => handleChange("ProductID", val)}
            options={products.map((p) => ({
              value: p.ProductID,
              label: p.ProductName,
            }))}
          />
        </label>

        <label>
          Quantity
          <input
            required
            type="number"
            min="1"
            value={form.Quantity}
            onChange={(e) => handleChange("Quantity", e.target.value)}
          />
        </label>

        <label>
          Purchase Date
          <input
            required
            type="date"
            value={form.PurchaseDate}
            onChange={(e) => handleChange("PurchaseDate", e.target.value)}
          />
        </label>

        <label>
          Location
          <select
            required
            value={form.Location}
            onChange={(e) => handleChange("Location", e.target.value)}
          >
            <option value="">Select location</option>
            {WAREHOUSE_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </label>

        {isFifo && (
          <label>
            Expiry Date
            <input
              required
              type="date"
              value={form.ExpirationDate}
              onChange={(e) => handleChange("ExpirationDate", e.target.value)}
            />
          </label>
        )}

        <label>
          Performed By
          <input
            required
            type="text"
            value={form.PerformedBy}
            onChange={(e) => handleChange("PerformedBy", e.target.value)}
          />
        </label>

        <label className="form-grid-full">
          Notes
          <textarea
            value={form.Notes}
            onChange={(e) => handleChange("Notes", e.target.value)}
            rows={2}
          />
        </label>

        {willExceedMax && (
          <p className="form-warning form-grid-full">
            ⚠ Warning: this purchase will push {selectedProduct.ProductName} above its
            max stock threshold ({selectedProduct.MaxStock}).
          </p>
        )}

        {message && (
          <p className={`form-message form-grid-full ${message.type}`}>
            {message.text}
          </p>
        )}

        <div className="form-grid-full">
          <button type="submit" className="btn btn-primary">
            Record Stock In
          </button>
        </div>
      </form>
    </div>
  );
}

function StockOutForm() {
  const { products, addTransaction, getActiveBatchesByProduct } =
    useContext(AppContext);
  const [form, setForm] = useState(STOCK_OUT_EMPTY);
  const [message, setMessage] = useState(null);

  const selectedProduct = products.find(
    (p) => p.ProductID === Number(form.ProductID)
  );

  const activeBatches = useMemo(() => {
    if (!selectedProduct) return [];
    return getActiveBatchesByProduct(selectedProduct.ProductID);
  }, [selectedProduct, getActiveBatchesByProduct]);

  const oldestBatch = activeBatches[0] || null;

  const notesRequired =
    form.TransactionType === "RETURN" || form.TransactionType === "EXPIRED";

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!form.ProductID) {
      setMessage({ type: "error", text: "Please pick a product from the list." });
      return;
    }

    if (notesRequired && !form.Notes.trim()) {
      setMessage({
        type: "error",
        text: `Notes are required for ${form.TransactionType} transactions.`,
      });
      return;
    }

    if (
      (form.TransactionType === "SALE" || form.TransactionType === "EXPIRED") &&
      !oldestBatch
    ) {
      setMessage({
        type: "error",
        text: `No active batch available for ${selectedProduct?.ProductName || "this product"}.`,
      });
      return;
    }

    const result = await addTransaction({
      ProductID: Number(form.ProductID),
      TransactionType: form.TransactionType,
      Quantity: Number(form.Quantity),
      TransactionDate: new Date().toISOString().slice(0, 10),
      PerformedBy: form.PerformedBy,
      Notes: form.Notes,
    });

    if (result.success) {
      setMessage({ type: "success", text: "Stock out recorded successfully." });
      setForm(STOCK_OUT_EMPTY);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  }

  return (
    <div className="panel">
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Product
          <SearchSelect
            placeholder="Type to search product..."
            value={form.ProductID}
            onChange={(val) => handleChange("ProductID", val)}
            options={products.map((p) => ({
              value: p.ProductID,
              label: p.ProductName,
            }))}
          />
        </label>

        <label>
          Transaction Type
          <select
            value={form.TransactionType}
            onChange={(e) => handleChange("TransactionType", e.target.value)}
          >
            <option value="SALE">SALE</option>
            <option value="RETURN">RETURN</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>
        </label>

        <label>
          Quantity
          <input
            required
            type="number"
            min="1"
            value={form.Quantity}
            onChange={(e) => handleChange("Quantity", e.target.value)}
          />
        </label>

        <label>
          Performed By
          <input
            required
            type="text"
            value={form.PerformedBy}
            onChange={(e) => handleChange("PerformedBy", e.target.value)}
          />
        </label>

        <label className="form-grid-full">
          Notes {notesRequired && <span className="required-mark">*</span>}
          <textarea
            value={form.Notes}
            onChange={(e) => handleChange("Notes", e.target.value)}
            rows={2}
          />
        </label>

        {selectedProduct && (
          <div className="form-grid-full info-box">
            {oldestBatch ? (
              <>
                <strong>FIFO — Next batch to use:</strong>
                <div>Batch #{oldestBatch.BatchID}</div>
                <div>Purchased: {oldestBatch.PurchaseDate}</div>
                <div>Location: {oldestBatch.Location}</div>
                <div>Remaining Stock: {oldestBatch.RemainingStock}</div>
              </>
            ) : (
              <span className="text-danger">
                No active batch available for {selectedProduct.ProductName}.
              </span>
            )}
          </div>
        )}

        {message && (
          <p className={`form-message form-grid-full ${message.type}`}>
            {message.text}
          </p>
        )}

        <div className="form-grid-full">
          <button type="submit" className="btn btn-primary">
            Record Stock Out
          </button>
        </div>
      </form>
    </div>
  );
}