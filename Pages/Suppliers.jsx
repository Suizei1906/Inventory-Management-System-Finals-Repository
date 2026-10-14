import React, { useContext, useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";

const EMPTY_FORM = {
  SupplierName: "",
  ContactPerson: "",
  Phone: "",
  Email: "",
  Address: "",
};

export default function Suppliers() {
  const { suppliers, products, addSupplier, updateSupplier, deleteSupplier } =
    useContext(AppContext);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const productCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.SuppliersID] = (counts[p.SuppliersID] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.SupplierName.toLowerCase().includes(term) ||
        (s.ContactPerson || "").toLowerCase().includes(term) ||
        (s.Email || "").toLowerCase().includes(term)
    );
  }, [suppliers, search]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(s) {
    setEditingId(s.SuppliersID);
    setForm({
      SupplierName: s.SupplierName || "",
      ContactPerson: s.ContactPerson || "",
      Phone: s.Phone || "",
      Email: s.Email || "",
      Address: s.Address || "",
    });
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    const result = editingId
      ? await updateSupplier(editingId, form)
      : await addSupplier(form);
    setSaving(false);

    if (!result.success) {
      setFormError(result.message);
      return;
    }
    setModalOpen(false);
    setMessage({
      type: "success",
      text: editingId ? "Supplier updated." : "Supplier added.",
    });
  }

  async function handleDelete(s) {
    if (!window.confirm(`Delete supplier "${s.SupplierName}"?`)) return;
    const result = await deleteSupplier(s.SuppliersID);
    setMessage(
      result.success
        ? { type: "success", text: "Supplier deleted." }
        : { type: "error", text: result.message }
    );
  }

  return (
    <div className="page">
      <Head title="Suppliers" />
      <div className="page-header-row">
        <h1 className="page-title">Supplier Management</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Supplier
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by supplier, contact person or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input filter-input-wide"
        />
      </div>

      {message && <p className={`form-message ${message.type}`}>{message.text}</p>}

      <div className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-cell">
                    No suppliers found.
                  </td>
                </tr>
              )}
              {filtered.map((s) => (
                <tr key={s.SuppliersID}>
                  <td>{s.SupplierName}</td>
                  <td>{s.ContactPerson || "—"}</td>
                  <td>{s.Phone || "—"}</td>
                  <td>{s.Email || "—"}</td>
                  <td>{s.Address || "—"}</td>
                  <td>{productCounts[s.SuppliersID] || 0}</td>
                  <td>
                    <div className="action-btn-group">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => openEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(s)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Supplier" : "Add Supplier"}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              form="supplier-form"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Supplier"}
            </button>
          </>
        }
      >
        <form id="supplier-form" onSubmit={handleSave} className="form-grid">
          {formError && <p className="login-error form-grid-full">{formError}</p>}

          <label className="form-grid-full">
            Supplier Name
            <input
              required
              type="text"
              value={form.SupplierName}
              onChange={(e) => handleChange("SupplierName", e.target.value)}
            />
          </label>

          <label>
            Contact Person
            <input
              type="text"
              value={form.ContactPerson}
              onChange={(e) => handleChange("ContactPerson", e.target.value)}
            />
          </label>

          <label>
            Phone
            <input
              type="text"
              value={form.Phone}
              onChange={(e) => handleChange("Phone", e.target.value)}
            />
          </label>

          <label className="form-grid-full">
            Email
            <input
              type="email"
              value={form.Email}
              onChange={(e) => handleChange("Email", e.target.value)}
            />
          </label>

          <label className="form-grid-full">
            Address
            <textarea
              rows={2}
              value={form.Address}
              onChange={(e) => handleChange("Address", e.target.value)}
            />
          </label>
        </form>
      </Modal>
    </div>
  );
}