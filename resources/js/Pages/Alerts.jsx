// src/pages/Alerts.jsx
import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";
import { TierBadge, NotificationStatusBadge } from "../components/Badge";

const TIER_LEGEND = [
  { tier: "T1", type: "Low Stock Watch", condition: "Current stock ≤ 1.5 × Reorder Point" },
  { tier: "T2", type: "Reorder Now", condition: "Current stock ≤ Reorder Point" },
  { tier: "T3", type: "Critical", condition: "Current stock < Safety Stock" },
  { tier: "T4", type: "Overstock Warning", condition: "Current stock > Max Stock" },
  { tier: "T5", type: "Expiry Warning", condition: "Batch expires within 90 days" },
];

const ALERT_TYPES = [
  "Low Stock Watch",
  "Reorder Now",
  "Critical",
  "Overstock Warning",
  "Expiry Warning",
];

export default function Alerts() {
  const { notifications, getProductById, acknowledgeAlert, ignoreAlert } =
    useContext(AppContext);

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAlerts = useMemo(() => {
    return notifications
      .filter((n) => {
        const matchesType = typeFilter === "all" || n.NotificationType === typeFilter;
        const matchesStatus = statusFilter === "all" || n.Status === statusFilter;
        return matchesType && matchesStatus;
      })
      .sort((a, b) => new Date(b.NotificationDate) - new Date(a.NotificationDate));
  }, [notifications, typeFilter, statusFilter]);

  const hasPending = notifications.some((n) => n.Status === "Pending");

  return (
    <div className="page">
      <h1 className="page-title">Alerts</h1>

      <div className="panel">
        <h2 className="panel-title">Alert Tiers</h2>
        <div className="tier-legend">
          {TIER_LEGEND.map((t) => (
            <div key={t.tier} className="tier-legend-item">
              <TierBadge type={t.type} />
              <div>
                <div className="tier-legend-name">{t.type}</div>
                <div className="tier-legend-condition">{t.condition}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          {ALERT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="Ignored">Ignored</option>
        </select>
      </div>

      <div className="panel">
        {!hasPending && typeFilter === "all" && statusFilter === "all" ? (
          <p className="empty-cell">No active alerts. All good!</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Product</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-cell">
                      No alerts match your filters.
                    </td>
                  </tr>
                )}
                {filteredAlerts.map((n) => {
                  const product = getProductById(n.ProductID);
                  return (
                    <tr key={n.NotificationID}>
                      <td>
                        <TierBadge type={n.NotificationType} />
                      </td>
                      <td>{product ? product.ProductName : "Unknown"}</td>
                      <td>{n.NotificationMessage}</td>
                      <td>{n.NotificationDate}</td>
                      <td>
                        <NotificationStatusBadge status={n.Status} />
                      </td>
                      <td>
                        {n.Status === "Pending" ? (
                          <div className="action-btn-group">
                            <button
                              className="btn btn-small btn-success"
                              onClick={() => acknowledgeAlert(n.NotificationID)}
                            >
                              Acknowledge
                            </button>
                            <button
                              className="btn btn-small btn-secondary"
                              onClick={() => ignoreAlert(n.NotificationID)}
                            >
                              Ignore
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
