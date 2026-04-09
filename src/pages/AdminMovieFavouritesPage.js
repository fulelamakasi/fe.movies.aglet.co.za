import React, { useState, useEffect, useCallback } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import Modal from '../components/Modal';
import { movieFavouriteService, movieService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';

export default function AdminMovieFavouritesPage() {
  const { user } = useAuth();
  const { resolvedUserId, refreshFavourites } = useFavourites();

  const [items, setItems] = useState([]);
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ movie_id: '', user_id: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Build lookup maps for display
  const movieMap = {};
  movies.forEach((m) => { movieMap[m.id] = m.title; });
  const userMap = {};
  users.forEach((u) => { userMap[u.id] = u.name; });

  const fetchAll = useCallback(async () => {
    if (!resolvedUserId) return;
    setLoading(true);
    setError(null);
    try {
      // Always fetch movies (needed for the dropdown)
      const movieData = await movieService.getAll();
      setMovies(Array.isArray(movieData) ? movieData : []);

      // Try to fetch all users — if this works, user is admin
      let userArr = [];
      let adminUser = false;
      try {
        const userData = await userService.getAll();
        userArr = Array.isArray(userData) ? userData : [];
        adminUser = userArr.length > 0;
      } catch (e) {
        // Not admin — can't list users, that's fine
        adminUser = false;
      }
      setUsers(userArr);
      setIsAdmin(adminUser);

      // Try getAll first (admin), fallback to getByUser (regular user)
      let favData;
      try {
        if (adminUser) {
          favData = await movieFavouriteService.getAll();
        } else {
          favData = await movieFavouriteService.getByUser(resolvedUserId);
        }
      } catch (e) {
        // If getAll also 403s, try getByUser as fallback
        try {
          favData = await movieFavouriteService.getByUser(resolvedUserId);
        } catch (e2) {
          favData = [];
        }
      }
      setItems(Array.isArray(favData) ? favData : []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [resolvedUserId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      movie_id: '',
      user_id: isAdmin ? '' : String(resolvedUserId || ''),
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormData({
      movie_id: String(item.movie_id || ''),
      user_id: String(item.user_id || ''),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        movie_id: parseInt(formData.movie_id, 10),
        user_id: parseInt(formData.user_id, 10),
      };

      if (editing) {
        await movieFavouriteService.update(editing.id, payload);
        setSuccess('Favourite updated successfully');
      } else {
        await movieFavouriteService.create(payload);
        setSuccess('Favourite created successfully');
      }
      setModalOpen(false);
      fetchAll();
      refreshFavourites();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await movieFavouriteService.delete(id);
      setSuccess('Favourite deleted successfully');
      setDeleteConfirm(null);
      fetchAll();
      refreshFavourites();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const filtered = items.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const movieName = (movieMap[item.movie_id] || '').toLowerCase();
    const userName = (userMap[item.user_id] || '').toLowerCase();
    return (
      movieName.includes(q) ||
      userName.includes(q) ||
      String(item.id).includes(q)
    );
  });

  // If not yet resolved user, show loading
  if (!resolvedUserId) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner" />
          <span>Resolving user...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h2>Movie Favourites</h2>
        <p>{isAdmin ? 'Manage all user movie favourites' : 'Manage your movie favourites'}</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="toolbar">
        <div className="toolbar-search">
          <MdSearch />
          <input
            placeholder="Search by movie or user name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <MdAdd /> Add Favourite
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <span>Loading...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No Favourites Found</h3>
          <p>Try adjusting your search or add a new favourite.</p>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Movie</th>
                <th>User</th>
                <th>Status</th>
                <th>Created</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{movieMap[item.movie_id] || `Movie #${item.movie_id}`}</td>
                  <td>{userMap[item.user_id] || (item.user_id === resolvedUserId ? (user?.name || 'You') : `User #${item.user_id}`)}</td>
                  <td>
                    <span className={`badge ${item.is_active ? 'badge-active' : 'badge-inactive'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{item.created_at || '—'}</td>
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
          title={editing ? 'Edit Favourite' : 'Add Favourite'}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving || !formData.movie_id || !formData.user_id}
              >
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </>
          }
        >
          {/* Movie dropdown — shows movie title */}
          <div className="form-group">
            <label>Movie *</label>
            <select
              className="form-control"
              value={formData.movie_id}
              onChange={(e) => setFormData({ ...formData, movie_id: e.target.value })}
            >
              <option value="">Select a movie...</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          {/* User dropdown — only for admin; non-admin sees their own name locked */}
          {isAdmin ? (
            <div className="form-group">
              <label>User *</label>
              <select
                className="form-control"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              >
                <option value="">Select a user...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label>User</label>
              <input
                className="form-control"
                value={user?.name || 'Current User'}
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>
          )}
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
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>
                Delete
              </button>
            </>
          }
        >
          <p>
            Are you sure you want to remove <strong>{movieMap[deleteConfirm.movie_id] || 'this movie'}</strong> from
            {' '}{deleteConfirm.user_id === resolvedUserId ? 'your' : <strong>{userMap[deleteConfirm.user_id] || "this user's"}</strong>} favourites?
          </p>
        </Modal>
      )}
    </div>
  );
}
