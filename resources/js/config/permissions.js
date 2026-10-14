export const ROLES = {
  ADMIN: "Admin",
  WAREHOUSE_STAFF: "Warehouse Staff",
  PURCHASING_MANAGER: "Purchasing Manager",
  SALES_STAFF: "Sales Staff",
};

const ALL_ROLES = [
  ROLES.ADMIN,
  ROLES.WAREHOUSE_STAFF,
  ROLES.PURCHASING_MANAGER,
  ROLES.SALES_STAFF,
];

// Path -> roles allowed to view that page (used to hide sidebar links;
// the server enforces the same rules in routes/web.php).
export const PAGE_PERMISSIONS = {
  "/": ALL_ROLES,
  "/products": [ROLES.ADMIN, ROLES.PURCHASING_MANAGER],
  "/transaction": ALL_ROLES,
  "/report": [ROLES.ADMIN, ROLES.PURCHASING_MANAGER, ROLES.SALES_STAFF],
  "/alerts": [ROLES.ADMIN, ROLES.WAREHOUSE_STAFF, ROLES.PURCHASING_MANAGER],
  "/location": [ROLES.ADMIN, ROLES.WAREHOUSE_STAFF],
  "/suppliers": [ROLES.ADMIN, ROLES.PURCHASING_MANAGER],
  "/locations": [ROLES.ADMIN, ROLES.WAREHOUSE_STAFF],
  "/settings": ALL_ROLES,
};

export function canAccessPage(role, path) {
  const allowed = PAGE_PERMISSIONS[path];
  if (!allowed) return true;
  return allowed.includes(role);
}

export function canRecordPurchases(role) {
  // Sales Staff only sell, they don't receive stock.
  return role !== ROLES.SALES_STAFF;
}

export function canViewAllUsers(role) {
  return role === ROLES.ADMIN;
}