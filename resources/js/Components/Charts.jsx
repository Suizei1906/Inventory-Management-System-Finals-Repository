// src/components/Charts.jsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Palette mirrors the CSS variables in index.css. Recharts renders raw SVG
// and doesn't reliably resolve var() in every browser/export path, so the
// hex values are duplicated here on purpose.
const COLORS = {
  blue: "#006D5B",
  blueDark: "#00503F",
  green: "#166534",
  yellow: "#92400E",
  orange: "#9A3412",
  red: "#991B1B",
  purple: "#6B21A8",
  gray: "#6B7280",
};

const TRANSACTION_TYPE_COLORS = {
  PURCHASE: COLORS.blue,
  SALE: COLORS.green,
  RETURN: COLORS.yellow,
  EXPIRED: COLORS.red,
};

const TIER_COLORS = {
  "Low Stock Watch": COLORS.blue,
  "Reorder Now": COLORS.yellow,
  Critical: COLORS.red,
  "Overstock Warning": COLORS.purple,
  "Expiry Warning": COLORS.orange,
};

export function StockLevelsChart({ products }) {
  const data = products.map((p) => ({
    name: p.ProductName.length > 14 ? p.ProductName.slice(0, 13) + "…" : p.ProductName,
    "Current Stock": p.CurrentStock,
    "Reorder Point": p.ReorderStock,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={60} fontSize={11} />
        <YAxis fontSize={11} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Current Stock" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Reorder Point" fill={COLORS.yellow} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TransactionTypeChart({ transactions }) {
  const counts = {};
  transactions.forEach((t) => {
    counts[t.TransactionType] = (counts[t.TransactionType] || 0) + 1;
  });
  const data = Object.entries(counts).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  if (data.length === 0) {
    return <p className="empty-cell">No transaction data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={95}
          paddingAngle={2}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={TRANSACTION_TYPE_COLORS[entry.name] || COLORS.gray}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SalesTrendChart({ transactions }) {
  const salesByDate = {};
  transactions
    .filter((t) => t.TransactionType === "SALE")
    .forEach((t) => {
      salesByDate[t.TransactionDate] =
        (salesByDate[t.TransactionDate] || 0) + Number(t.Quantity);
    });

  const data = Object.entries(salesByDate)
    .map(([date, qty]) => ({ date, "Units Sold": qty }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (data.length === 0) {
    return <p className="empty-cell">No sales recorded yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: -12, bottom: 20 }}>
        <defs>
          <linearGradient id="salesTrendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.35} />
            <stop offset="95%" stopColor={COLORS.orange} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="date" angle={-30} textAnchor="end" height={50} fontSize={11} />
        <YAxis fontSize={11} allowDecimals={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="Units Sold"
          stroke={COLORS.orange}
          strokeWidth={2.5}
          fill="url(#salesTrendGradient)"
          dot={{ r: 3, fill: COLORS.orange, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AlertsByTierChart({ notifications }) {
  const order = [
    "Low Stock Watch",
    "Reorder Now",
    "Critical",
    "Overstock Warning",
    "Expiry Warning",
  ];
  const counts = {};
  notifications.forEach((n) => {
    counts[n.NotificationType] = (counts[n.NotificationType] || 0) + 1;
  });
  const data = order.map((type) => ({ name: type, count: counts[type] || 0 }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 55 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={75} fontSize={11} />
        <YAxis fontSize={11} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={TIER_COLORS[entry.name] || COLORS.gray} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
