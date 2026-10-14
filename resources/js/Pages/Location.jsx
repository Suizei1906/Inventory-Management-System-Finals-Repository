// src/pages/Location.jsx
import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";
import { StatusBadge, BatchStatusBadge } from "../components/Badge";

export default function Location() {
  const { products, batches, getCategoryById, getBatchesByProduct } =
    useContext(AppContext);

  const [search, setSearch] = useState("");
  const [selectedProductID, setSelectedProductID] = useState(null);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase();
    return products.filter(
      (p) =>
        p.ProductName.toLowerCase().includes(term) ||
        p.Location.toLowerCase().includes(term)
    );
  }, [products, search]);

  const filteredBatches = useMemo(() => {
    const term = search.toLowerCase();
    return batches.filter((b) => {
      const product = products.find((p) => p.ProductID === b.ProductID);
      const productName = product ? product.ProductName.toLowerCase() : "";
      return productName.includes(term) || b.Location.toLowerCase().includes(term);
    });
  }, [batches, products, search]);

  // Determine, per product, which batch is the "PICK NEXT" (oldest active, remaining > 0)
  const pickNextBatchIDs = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const active = getBatchesByProduct(p.ProductID).filter(
        (b) => b.Status === "active" && b.RemainingStock > 0
      );
      if (active.length > 0) {
        map[active[0].BatchID] = true;
      }
    });
    return map;
  }, [products, getBatchesByProduct]);

  const selectedProductBatches = selectedProductID
    ? getBatchesByProduct(selectedProductID)
    : [];

  return (
    <div className="page">
      <h1 className="page-title">Location</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by product name or aisle/shelf/bin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input filter-input-wide"
        />
      </div>

      <div className="panel">
        <h2 className="panel-title">Products by Location</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Current Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-cell">
                    No products match your search.
                  </td>
                </tr>
              )}
              {filteredProducts.map((p) => {
                const category = getCategoryById(p.CategoryID);
                return (
                  <tr
                    key={p.ProductID}
                    onClick={() => setSelectedProductID(p.ProductID)}
                    className={
                      "row-clickable " +
                      (selectedProductID === p.ProductID ? "row-selected" : "")
                    }
                  >
                    <td>{p.ProductName}</td>
                    <td>{category ? category.CategoryName : "-"}</td>
                    <td>{p.Location}</td>
                    <td>{p.CurrentStock}</td>
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

        {selectedProductID && (
          <div className="location-batches-preview">
            <h3>
              Batches for{" "}
              {products.find((p) => p.ProductID === selectedProductID)?.ProductName}
            </h3>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Batch ID</th>
                    <th>Location</th>
                    <th>Purchase Date</th>
                    <th>Expiry Date</th>
                    <th>Remaining Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProductBatches.map((b) => (
                    <tr key={b.BatchID}>
                      <td>
                        #{b.BatchID}
                        {pickNextBatchIDs[b.BatchID] && (
                          <span className="pick-next-tag">PICK NEXT</span>
                        )}
                      </td>
                      <td>{b.Location}</td>
                      <td>{b.PurchaseDate}</td>
                      <td>{b.ExpirationDate || "—"}</td>
                      <td>{b.RemainingStock}</td>
                      <td>
                        <BatchStatusBadge status={b.Status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="panel">
        <h2 className="panel-title">Batches by Location</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Product Name</th>
                <th>Location</th>
                <th>Purchase Date</th>
                <th>Expiry Date</th>
                <th>Remaining Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-cell">
                    No batches match your search.
                  </td>
                </tr>
              )}
              {filteredBatches.map((b) => {
                const product = products.find((p) => p.ProductID === b.ProductID);
                return (
                  <tr key={b.BatchID}>
                    <td>
                      #{b.BatchID}
                      {pickNextBatchIDs[b.BatchID] && (
                        <span className="pick-next-tag">PICK NEXT</span>
                      )}
                    </td>
                    <td>{product ? product.ProductName : "Unknown"}</td>
                    <td>{b.Location}</td>
                    <td>{b.PurchaseDate}</td>
                    <td>{b.ExpirationDate || "—"}</td>
                    <td>{b.RemainingStock}</td>
                    <td>
                      <BatchStatusBadge status={b.Status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
