// src/pages/Report.jsx
import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";
import { TransactionTypeBadge } from "../components/Badge";

export default function Report() {
  const { products, transactions, getProductById } = useContext(AppContext);

  const [productFilter, setProductFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesProduct =
          productFilter === "all" || t.ProductID === Number(productFilter);
        const matchesType = typeFilter === "all" || t.TransactionType === typeFilter;
        const txDate = new Date(t.TransactionDate);
        const matchesFrom = !fromDate || txDate >= new Date(fromDate);
        const matchesTo = !toDate || txDate <= new Date(toDate);
        return matchesProduct && matchesType && matchesFrom && matchesTo;
      })
      .sort((a, b) => new Date(b.TransactionDate) - new Date(a.TransactionDate));
  }, [transactions, productFilter, typeFilter, fromDate, toDate]);

  return (
    <div className="page">
      <h1 className="page-title">Report</h1>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          {products.map((p) => (
            <option key={p.ProductID} value={p.ProductID}>
              {p.ProductName}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="PURCHASE">PURCHASE</option>
          <option value="SALE">SALE</option>
          <option value="RETURN">RETURN</option>
          <option value="EXPIRED">EXPIRED</option>
        </select>

        <label className="filter-date-label">
          From
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>

        <label className="filter-date-label">
          To
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </label>
      </div>

      <div className="panel">
        <p className="readonly-note">Read-only — rows cannot be edited or deleted</p>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Batch</th>
                <th>Performed By</th>
                <th>Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    No transactions match your filters.
                  </td>
                </tr>
              )}
              {filteredTransactions.map((t) => {
                const product = getProductById(t.ProductID);
                const isPurchase = t.TransactionType === "PURCHASE";
                return (
                  <tr key={t.TransactionID}>
                    <td>{t.TransactionID}</td>
                    <td>{product ? product.ProductName : "Unknown"}</td>
                    <td>
                      <TransactionTypeBadge type={t.TransactionType} />
                    </td>
                    <td className={isPurchase ? "qty-positive" : "qty-negative"}>
                      {isPurchase ? "+" : "-"}
                      {t.Quantity}
                    </td>
                    <td>{t.BatchID ?? "—"}</td>
                    <td>{t.PerformedBy}</td>
                    <td>{t.TransactionDate}</td>
                    <td>{t.Notes}</td>
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
