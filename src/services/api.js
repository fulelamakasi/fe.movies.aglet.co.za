const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000/api';
const APP_USER_ID = process.env.REACT_APP_USER_ID || '10235463-8728-0913-9837-127634524310';

export { APP_USER_ID };

function getUserId() {
  const token = localStorage.getItem('userToken');
  return token || APP_USER_ID;
}

async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, headers: extraHeaders = {} } = options;
  
  const headers = {
    'Content-Type': 'application/json',
    'User-Id': getUserId(),
    ...extraHeaders,
  };

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const error = new Error(errorData?.message || `API Error: ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }

  return response.json();
}

// ─── Authentication ───
export const authService = {
  login: (email, password) =>
    apiRequest('/auth/login/v1', { method: 'POST', body: { email, password } }),
  renewToken: () =>
    apiRequest('/auth/renew-token/v1', { method: 'PUT' }),
};

// ─── Movies ───
export const movieService = {
  getAll: () => apiRequest('/movies/v1'),
  getById: (id) => apiRequest(`/movies/v1/${id}`),
  create: (data) => apiRequest('/movies/v1', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/movies/v1/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/movies/v1/${id}`, { method: 'DELETE' }),
  getActive: (isDeleted) => apiRequest(`/movies/get-active/v1/${isDeleted}`),
  getByLanguage: (langId) => apiRequest(`/movies/get-by-language/v1/${langId}`),
};

// ─── Contact Us ───
export const contactUsService = {
  getAll: () => apiRequest('/contact_us/v1'),
  getById: (id) => apiRequest(`/contact_us/v1/${id}`),
  create: (data) => apiRequest('/contact_us/v1', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/contact_us/v1/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/contact_us/v1/${id}`, { method: 'DELETE' }),
  getActioned: (flag) => apiRequest(`/contact_us/get-actioned/v1/${flag}`),
};

// ─── Languages ───
export const languageService = {
  getAll: () => apiRequest('/languages/v1'),
  getById: (id) => apiRequest(`/languages/v1/${id}`),
  create: (data) => apiRequest('/languages/v1', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/languages/v1/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/languages/v1/${id}`, { method: 'DELETE' }),
  getActive: (isDeleted) => apiRequest(`/languages/get-active/v1/${isDeleted}`),
};

// ─── Permissions ───
export const permissionService = {
  getAll: () => apiRequest('/permissions/v1'),
  getById: (id) => apiRequest(`/permissions/v1/${id}`),
  create: (data) => apiRequest('/permissions/v1', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/permissions/v1/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/permissions/v1/${id}`, { method: 'DELETE' }),
  getActive: (isActive) => apiRequest(`/permissions/get-active/v1/${isActive}`),
};

// ─── Roles ───
export const roleService = {
  getAll: () => apiRequest('/roles/v1'),
  getById: (id) => apiRequest(`/roles/v1/${id}`),
  create: (data) => apiRequest('/roles/v1', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/roles/v1/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/roles/v1/${id}`, { method: 'DELETE' }),
  getActive: (isActive) => apiRequest(`/roles/get-active/v1/${isActive}`),
};

// ─── Role Permissions ───
export const rolePermissionService = {
  getAll: () => apiRequest('/role_permissions/v1'),
  getById: (id) => apiRequest(`/role_permissions/v1/${id}`),
  create: (data) => apiRequest('/role_permissions/v1', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/role_permissions/v1/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/role_permissions/v1/${id}`, { method: 'DELETE' }),
  getActive: (isActive) => apiRequest(`/role_permissions/get-active/v1/${isActive}`),
  getByPermission: (permId) => apiRequest(`/role_permissions/get-by-permission/v1/${permId}`),
  getByRole: (roleId) => apiRequest(`/role_permissions/get-by-role/v1/${roleId}`),
};

// ─── User Roles ───
export const userRoleService = {
  getAll: () => apiRequest('/user_roles/v1'),
  getById: (id) => apiRequest(`/user_roles/v1/${id}`),
  create: (data) => apiRequest('/user_roles/v1', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/user_roles/v1/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/user_roles/v1/${id}`, { method: 'DELETE' }),
  getActive: (isActive) => apiRequest(`/user_roles/get-active/v1/${isActive}`),
  getByUser: (userId) => apiRequest(`/user_roles/get-by-user/v1/${userId}`),
  getByRole: (roleId) => apiRequest(`/user_roles/get-by-role/v1/${roleId}`),
};

// ─── Movie Favourites ───
export const movieFavouriteService = {
  getAll: () => apiRequest('/movie_favourites/v1'),
  getById: (id) => apiRequest(`/movie_favourites/v1/${id}`),
  create: (data) => apiRequest('/movie_favourites/v1', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/movie_favourites/v1/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/movie_favourites/v1/${id}`, { method: 'DELETE' }),
  getActive: (isActive) => apiRequest(`/movie_favourites/get-active/v1/${isActive}`),
  getByUser: (userId) => apiRequest(`/movie_favourites/get-by-user/v1/${userId}`),
  getByMovie: (movieId) => apiRequest(`/movie_favourites/get-by-movie/v1/${movieId}`),
};

// ─── Users ───
export const userService = {
  getAll: () => apiRequest('/users/v1'),
  getById: (id) => apiRequest(`/users/v1/${id}`),
  create: (data) => apiRequest('/users/v1', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/users/v1/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/users/v1/${id}`, { method: 'DELETE' }),
  getActive: (isActive) => apiRequest(`/users/get-active/v1/${isActive}`),
  getByToken: (token) => apiRequest(`/users/get-by-token/v1/${token}`),
};
