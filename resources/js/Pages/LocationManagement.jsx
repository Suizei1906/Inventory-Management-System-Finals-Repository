import React, { useContext, useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";

export default function LocationManagement() {
  const { locations, products, batches, addLocation, updateLocation, deleteLocation } =
    useContext(AppContext);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // How many products / batches (with stock) sit in each location.
  const usage = useMemo(() => {
    const map = {};
    locations.forEach((l) => {
      map[l.LocationName] = { products: 0, batches: 0 };
    });
    products.forEach((p) => {
      if (map[p.Location]) map[p.Location].products += 1;
    });
    batches.forEach((b) => {
      if (map[b.Location] && b.RemainingStock > 0) map[b.Location].batches += 1;
    });
    return map;
  }, [locations, products, batches]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return locations.filter((l) => l.LocationName.toLowerCase().includes(term));
  }, [locations, search]);

  function openAdd() {
    setEditingId(null);
    setName("");
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(l) {
    setEditingId(l.LocationID);
    setName(l.LocationName);
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    const result = editingId
      ? await updateLocation(editingId, { LocationName: name.trim() })
      : await addLocation({ LocationName: name.trim() });
    setSaving(false);

    if (!result.success) {
      setFormError(result.message);
      return;
    }
    setModalOpen(false);
    setMessage({
      type: "success",
      text: editingId ? "Location updated." : "Location added.",
    });
  }

  async function handleDelete(l) {
    if (!window.confirm(`Delete location "${l.LocationName}"?`)) return;
    const result = await deleteLocation(l.LocationID);
    setMessage(
      result.success
        ? { type: "success", text: "Location deleted." }
        : { type: "error", text: result.message }
    );
  }

  return (
    <div className="page">
      <Head title="Manage Locations" />
      <div className="page-header-row">
        <h1 className="page-title">Location Management</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Location
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search locations..."
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
                <th>Location</th>
                <th>Products Stored</th>
                <th>Batches With Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-cell">
                    No locations found.
                  </td>
                </tr>
              )}
              {filtered.map((l) => (
                <tr key={l.LocationID}>
                  <td>{l.LocationName}</td>
                  <td>{usage[l.LocationName]?.products ?? 0}</td>
                  <td>{usage[l.LocationName]?.batches ?? 0}</td>
                  <td>
                    <div className="action-btn-group">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => openEdit(l)}
                      >
                        Rename
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(l)}
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
        <p className="readonly-note">
          Renaming a location also updates every product and batch stored there.
          A location can only be deleted when nothing is stored in it.
        </p>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Rename Location" : "Add Location"}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              form="location-form"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Location"}
            </button>
          </>
        }
      >
        <form id="location-form" onSubmit={handleSave} className="form-grid">
          {formError && <p className="login-error form-grid-full">{formError}</p>}
          <label className="form-grid-full">
            Location Name
            <input
              required
              type="text"
              maxLength={100}
              placeholder="e.g. Aisle E - Shelf 1 - Bin 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </label>
        </form>
      </Modal>
    </div>
  );
}