import "../css/app.css";
import "../css/extra.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/Sidebar";

const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
const GUEST_PAGES = ["Login", "Signup"];

function AppLayout({ children }) {
  return (
    <AppProvider>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">{children}</main>
      </div>
    </AppProvider>
  );
}

createInertiaApp({
  title: (title) => (title ? `${title} - WalangBrownout` : "WalangBrownout"),
  resolve: (name) => {
    const page = pages[`./Pages/${name}.jsx`];
    if (!page) throw new Error(`Inertia page not found: ${name}`);
    if (!GUEST_PAGES.includes(name)) {
      page.default.layout = (node) => <AppLayout>{node}</AppLayout>;
    }
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: { color: "#2563eb" },
});