import React, { useState, useEffect, useCallback } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdCheckCircle, MdVisibility, MdFilterList } from 'react-icons/md';
import Modal from '../components/Modal';
import { contactUsService } from '../services/api';

export default function AdminContactUsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'actioned', 'pending'

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone_number: '', company_name: '', message: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactUsService.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    setFormData({ name: '', email: '', phone_number: '', company_name: '', message: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormData({
      name: item.name || '',
      email: item.email || '',
      phone_number: item.phone_number || '',
      company_name: item.company_name || '',
      message: item.message || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await contactUsService.update(editing.id, formData);
        setSuccess('Record updated successfully');
      } else {
        await contactUsService.create(formData);
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
      await contactUsService.delete(id);
      setSuccess('Record deleted successfully');
      setDeleteConfirm(null);
      fetchItems();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const handleToggleActioned = async (item) => {
    setError(null);
    try {
      // Toggle is_actioned: 0 → 1 or 1 → 0
      const updatedData = {
        name: item.name,
        email: item.email,
        phone_number: item.phone_number,
        company_name: item.company_name,
        message: item.message,
        is_actioned: item.is_actioned ? 0 : 1,
      };
      await contactUsService.update(item.id, updatedData);
      setSuccess(item.is_actioned ? 'Marked as pending' : 'Marked as actioned');
      fetchItems();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  // Filter + search
  const filtered = items.filter((item) => {
    // Status filter
    if (filterStatus === 'actioned' && !item.is_actioned) return false;
    if (filterStatus === 'pending' && item.is_actioned) return false;

    // Search
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (item.name || '').toLowerCase().includes(q) ||
      (item.email || '').toLowerCase().includes(q) ||
      (item.company_name || '').toLowerCase().includes(q) ||
      (item.message || '').toLowerCase().includes(q)
    );
  });

  const pendingCount = items.filter((i) => !i.is_actioned).length;
  const actionedCount = items.filter((i) => i.is_actioned).length;

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h2>Contact Submissions</h2>
        <p>
          {items.length} total &middot;{' '}
          <span style={{ color: 'var(--warning)' }}>{pendingCount} pending</span> &middot;{' '}
          <span style={{ color: 'var(--success)' }}>{actionedCount} actioned</span>
        </p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="toolbar">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="toolbar-search">
            <MdSearch />
            <input
              placeholder="Search submissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter buttons */}
          <div className="btn-group">
            <button
              className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('all')}
            >
              <MdFilterList /> All ({items.length})
            </button>
            <button
              className={`btn btn-sm ${filterStatus === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('pending')}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`btn btn-sm ${filterStatus === 'actioned' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('actioned')}
            >
              Actioned ({actionedCount})
            </button>
          </div>
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
          <h3>No Submissions Found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Status</th>
                <th>Created</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} style={!item.is_actioned ? { borderLeft: '3px solid var(--warning)' } : {}}>
                  <td>{item.id}</td>
                  <td style={{ fontWeight: !item.is_actioned ? 600 : 400 }}>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone_number}</td>
                  <td>{item.company_name}</td>
                  <td>
                    <span className={`badge ${item.is_actioned ? 'badge-active' : 'badge-inactive'}`}>
                      {item.is_actioned ? 'Actioned' : 'Pending'}
                    </span>
                  </td>
                  <td>{item.created_at || '—'}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-icon"
                        onClick={() => setViewItem(item)}
                        title="View message"
                        style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                      >
                        <MdVisibility />
                      </button>
                      <button
                        className={`btn btn-sm btn-icon`}
                        onClick={() => handleToggleActioned(item)}
                        title={item.is_actioned ? 'Mark as pending' : 'Mark as actioned'}
                        style={{
                          color: item.is_actioned ? 'var(--warning)' : 'var(--success)',
                          border: `1px solid ${item.is_actioned ? 'var(--warning)' : 'var(--success)'}`,
                        }}
                      >
                        <MdCheckCircle />
                      </button>
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

      {/* View Message Modal */}
      {viewItem && (
        <Modal
          title="Contact Submission"
          onClose={() => setViewItem(null)}
          footer={
            <div style={{ display: 'flex', gap: 8, width: '100%', justifyContent: 'space-between' }}>
              <button
                className="btn btn-sm"
                onClick={() => { handleToggleActioned(viewItem); setViewItem(null); }}
                style={{
                  color: viewItem.is_actioned ? 'var(--warning)' : 'var(--success)',
                  border: `1px solid ${viewItem.is_actioned ? 'var(--warning)' : 'var(--success)'}`,
                }}
              >
                <MdCheckCircle />
                {viewItem.is_actioned ? ' Mark as Pending' : ' Mark as Actioned'}
              </button>
              <button className="btn btn-secondary" onClick={() => setViewItem(null)}>Close</button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                From
              </label>
              <div style={{ fontWeight: 600 }}>{viewItem.name}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{viewItem.email} &middot; {viewItem.phone_number}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{viewItem.company_name}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Message
              </label>
              <div style={{
                padding: 16,
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                lineHeight: 1.7,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap',
              }}>
                {viewItem.message}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Status
                </label>
                <span className={`badge ${viewItem.is_actioned ? 'badge-active' : 'badge-inactive'}`}>
                  {viewItem.is_actioned ? 'Actioned' : 'Pending'}
                </span>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Submitted
                </label>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{viewItem.created_at || '—'}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <Modal
          title={editing ? 'Edit Submission' : 'Add Submission'}
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
          <div className="form-group">
            <label>Name *</label>
            <input className="form-control" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input className="form-control" type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
            <input className="form-control" value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Company Name *</label>
            <input className="form-control" value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Message *</label>
            <textarea className="form-control" value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <Modal
          title="Confirm Delete"
          onClose={() => setDeleteConfirm(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
            </>
          }
        >
          <p>Are you sure you want to delete the submission from <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
}
