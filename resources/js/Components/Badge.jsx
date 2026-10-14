// src/components/Badge.jsx
import React from "react";

export default function Badge({ type, children }) {
  return <span className={`badge badge-${type}`}>{children}</span>;
}

// Maps a product's stock numbers to the right visual badge.
export function StatusBadge({ currentStock, reorderStock, safetyStock, maxStock }) {
  if (currentStock < safetyStock) {
    return <Badge type="red">Critical</Badge>;
  }
  if (currentStock <= reorderStock) {
    return <Badge type="yellow">Low Stock</Badge>;
  }
  if (currentStock > maxStock) {
    return <Badge type="purple">Overstock</Badge>;
  }
  return <Badge type="green">OK</Badge>;
}

const TIER_MAP = {
  "Low Stock Watch": { label: "T1", type: "blue" },
  "Reorder Now": { label: "T2", type: "yellow" },
  Critical: { label: "T3", type: "red" },
  "Overstock Warning": { label: "T4", type: "purple" },
  "Expiry Warning": { label: "T5", type: "orange" },
};

export function TierBadge({ type }) {
  const tier = TIER_MAP[type] || { label: "?", type: "gray" };
  return <Badge type={tier.type}>{tier.label}</Badge>;
}

export function TransactionTypeBadge({ type }) {
  const map = {
    PURCHASE: "blue",
    SALE: "green",
    RETURN: "yellow",
    EXPIRED: "red",
  };
  return <Badge type={map[type] || "gray"}>{type}</Badge>;
}

export function OrderStatusBadge({ status }) {
  const map = {
    Pending: "yellow",
    Received: "green",
    Cancelled: "gray",
    Failed: "red",
  };
  return <Badge type={map[status] || "gray"}>{status}</Badge>;
}

export function NotificationStatusBadge({ status }) {
  const map = {
    Pending: "yellow",
    Acknowledged: "green",
    Ignored: "gray",
  };
  return <Badge type={map[status] || "gray"}>{status}</Badge>;
}

export function BatchStatusBadge({ status }) {
  const map = {
    active: "green",
    depleted: "gray",
    expired: "red",
  };
  return <Badge type={map[status] || "gray"}>{status}</Badge>;
}
