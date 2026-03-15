import React, { useState, useEffect, useCallback } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import Modal from './Modal';

/**
 * Generic CRUD page for any model.
 * Props:
 *   title          - page title
 *   subtitle       - page description
 *   service        - { getAll, create, update, delete } api methods
 *   columns        - [{ key, label, render? }]
 *   formFields     - [{ key, label, type?, required?, placeholder?, options? }]
 *   idField        - default 'id'
 */
export default function CrudPage({ title, subtitle, service, columns, formFields, idField = 'id' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    const defaults = {};
    formFields.forEach((f) => { defaults[f.key] = f.defaultValue || ''; });
    setFormData(defaults);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    const data = {};
    formFields.forEach((f) => { data[f.key] = item[f.key] ?? ''; });
    setFormData(data);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await service.update(editing[idField], formData);
        setSuccess('Record updated successfully');
      } else {
        await service.create(formData);
        setSuccess('Record created successfully');
      }
      setModalOpen(false);
      fetchItems();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await service.delete(id);
      setSuccess('Record deleted successfully');
      setDeleteConfirm(null);
      fetchItems();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const filtered = items.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return columns.some((col) => {
      const val = item[col.key];
      return val != null && String(val).toLowerCase().includes(q);
    });
  });

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="toolbar">
        <div className="toolbar-search">
          <MdSearch />
          <input
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <MdAdd /> Add New
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <span>Loading...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No Records Found</h3>
          <p>Try adjusting your search or add a new record.</p>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item[idField]}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(item[col.key], item) : (item[col.key] ?? '—')}
                    </td>
                  ))}
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(item)} title="Edit">
                        <MdEdit />
                      </button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteConfirm(item)} title="Delete">
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <Modal
          title={editing ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </>
          }
        >
          {formFields.map((field) => (
            <div className="form-group" key={field.key}>
              <label>{field.label}{field.required && ' *'}</label>
              {field.type === 'textarea' ? (
                <textarea
                  className="form-control"
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                />
              ) : field.type === 'select' ? (
                <select
                  className="form-control"
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                >
                  <option value="">Select...</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="form-control"
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal
          title="Confirm Delete"
          onClose={() => setDeleteConfirm(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm[idField])}>
                Delete
              </button>
            </>
          }
        >
          <p>Are you sure you want to delete this record? This action cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
}
