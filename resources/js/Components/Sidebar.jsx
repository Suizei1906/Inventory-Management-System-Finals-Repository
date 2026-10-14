import React, { useContext, useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { AppContext } from "../context/AppContext";
import { canAccessPage } from "../config/permissions";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/products", label: "Products", icon: "📦" },
  { to: "/transaction", label: "Transaction", icon: "🔄" },
  { to: "/report", label: "Report", icon: "📄" },
  { to: "/alerts", label: "Alerts", icon: "🔔" },
  { to: "/location", label: "Location", icon: "📍" },
  { to: "/suppliers", label: "Suppliers", icon: "🏭" },
  { to: "/locations", label: "Manage Locations", icon: "🗂️" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const { user, logout, getPendingAlertCount } = useContext(AppContext);
  const { url } = usePage();
  const pendingCount = getPendingAlertCount();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleNavItems = useMemo(() => {
    if (!user) return [];
    return NAV_ITEMS.filter((item) => canAccessPage(user.Role, item.to));
  }, [user]);

  // Exact match for "/", prefix match for the rest.
  function isActive(item) {
    const path = url.split("?")[0];
    return item.end ? path === item.to : path === item.to || path.startsWith(item.to + "/");
  }

  function handleLogout() {
    setMobileOpen(false);
    logout();
  }

  function handleNavClick() {
    setMobileOpen(false);
  }

  return (
    <>
      {/* Mobile top bar — only visible below the tablet breakpoint */}
      <div className="mobile-topbar">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
        <span className="mobile-topbar-brand">⚡ WalangBrownout</span>
        {pendingCount > 0 && (
          <span className="mobile-topbar-alert-badge">{pendingCount}</span>
        )}
      </div>

      {/* Backdrop shown behind the sidebar when open on mobile */}
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">⚡</span>
          <span className="sidebar-brand-name">WalangBrownout</span>
          <button
            className="sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <nav className="sidebar-nav">
          {visibleNavItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              onClick={handleNavClick}
              className={
                "sidebar-link" +
                (isActive(item) ? " sidebar-link-active" : "")
              }
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
              {item.label === "Alerts" && pendingCount > 0 && (
                <span className="sidebar-alert-badge">{pendingCount}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user">
              <div className="sidebar-user-name">{user.UserName}</div>
              <div className="sidebar-user-role">{user.Role}</div>
            </div>
          )}
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}