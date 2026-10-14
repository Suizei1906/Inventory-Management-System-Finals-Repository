// src/pages/Dashboard.jsx
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { StatusBadge, TransactionTypeBadge } from "../components/Badge";
import {
  StockLevelsChart,
  TransactionTypeChart,
  SalesTrendChart,
  AlertsByTierChart,
} from "../components/Charts";

function DaysOfSupplyBar({ days }) {
  let colorClass = "dos-bar-green";
  if (days < 14) colorClass = "dos-bar-red";
  else if (days <= 30) colorClass = "dos-bar-yellow";

  const widthPct = Math.min(100, (days / 60) * 100);

  return (
    <div className="dos-bar-track">
      <div className={`dos-bar-fill ${colorClass}`} style={{ width: `${widthPct}%` }} />
      <span className="dos-bar-label">{days}d</span>
    </div>
  );
}

export default function Dashboard() {
  const {
    products,
    batches,
    transactions,
    notifications,
    categories,
    getCategoryById,
    getStockStatus,
    getDaysOfSupply,
    getPendingAlertCount,
  } = useContext(AppContext);

  const totalProducts = products.length;

  const lowStockItems = products.filter((p) => {
    const status = getStockStatus(p);
    return status === "Low Stock" || status === "Critical";
  }).length;

  const today = new Date();
  const expiringSoon = batches.filter((b) => {
    if (!b.ExpirationDate) return false;
    const daysUntil = Math.ceil(
      (new Date(b.ExpirationDate) - today) / (1000 * 60 * 60 * 24)
    );
    return daysUntil <= 90;
  }).length;

  const activeAlerts = getPendingAlertCount();

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.TransactionDate) - new Date(a.TransactionDate))
    .slice(0, 5);

  const pendingAlertsPreview = notifications
    .filter((n) => n.Status === "Pending")
    .slice(0, 3);

  function productName(id) {
    const p = products.find((pr) => pr.ProductID === id);
    return p ? p.ProductName : "Unknown";
  }

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-top">
            <div className="summary-card-icon icon-blue">📦</div>
            <span className="summary-card-trend trend-neutral">
              {categories.length} categories
            </span>
          </div>
          <div className="summary-card-value">{totalProducts}</div>
          <div className="summary-card-label">Total Products</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-top">
            <div className="summary-card-icon icon-orange">⚠</div>
            <span className="summary-card-trend trend-live">Live</span>
          </div>
          <div className="summary-card-value">{lowStockItems}</div>
          <div className="summary-card-label">Low Stock Items</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-top">
            <div className="summary-card-icon icon-red">📅</div>
            <span className="summary-card-trend trend-warn">Next 90 days</span>
          </div>
          <div className="summary-card-value">{expiringSoon}</div>
          <div className="summary-card-label">Expiring Soon</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-top">
            <div className="summary-card-icon icon-green">🔔</div>
            <span
              className={`summary-card-trend ${
                activeAlerts > 0 ? "trend-warn" : "trend-positive"
              }`}
            >
              {activeAlerts > 0 ? "Needs action" : "All clear"}
            </span>
          </div>
          <div className="summary-card-value">{activeAlerts}</div>
          <div className="summary-card-label">Active Alerts</div>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">Products Overview</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Point</th>
                <th>Days of Supply</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const category = getCategoryById(p.CategoryID);
                return (
                  <tr key={p.ProductID}>
                    <td>{p.ProductName}</td>
                    <td>{category ? category.CategoryName : "-"}</td>
                    <td>{p.CurrentStock}</td>
                    <td>{p.ReorderStock}</td>
                    <td>
                      <DaysOfSupplyBar days={getDaysOfSupply(p.ProductID)} />
                    </td>
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

      <div className="panel-row">
        <div className="panel panel-half">
          <h2 className="panel-title">Recent Transactions</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="empty-cell">
                      No transactions yet.
                    </td>
                  </tr>
                )}
                {recentTransactions.map((t) => (
                  <tr key={t.TransactionID}>
                    <td>{productName(t.ProductID)}</td>
                    <td>
                      <TransactionTypeBadge type={t.TransactionType} />
                    </td>
                    <td>{t.Quantity}</td>
                    <td>{t.PerformedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel panel-half">
          <h2 className="panel-title">Active Alerts</h2>
          {pendingAlertsPreview.length === 0 ? (
            <p className="empty-cell">No active alerts. All good!</p>
          ) : (
            <ul className="alert-preview-list">
              {pendingAlertsPreview.map((n) => (
                <li key={n.NotificationID} className="alert-preview-item">
                  <strong>{productName(n.ProductID)}</strong> — {n.NotificationMessage}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <h2 className="section-heading">Statistics</h2>
      <div className="stats-grid">
        <div className="panel">
          <h2 className="panel-title">Stock Levels by Product</h2>
          <StockLevelsChart products={products} />
        </div>
        <div className="panel">
          <h2 className="panel-title">Transactions by Type</h2>
          <TransactionTypeChart transactions={transactions} />
        </div>
        <div className="panel">
          <h2 className="panel-title">Sales Trend</h2>
          <SalesTrendChart transactions={transactions} />
        </div>
        <div className="panel">
          <h2 className="panel-title">Alerts by Tier</h2>
          <AlertsByTierChart notifications={notifications} />
        </div>
      </div>
    </div>
  );
}
