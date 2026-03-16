import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavouritesProvider } from './context/FavouritesContext';
import Sidebar from './components/Sidebar';

// Pages
import MoviesPage from './pages/MoviesPage';
import FavouritesPage from './pages/FavouritesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';

// Admin Pages
import AdminMoviesPage from './pages/AdminMoviesPage';
import AdminLanguagesPage from './pages/AdminLanguagesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminRolesPage from './pages/AdminRolesPage';
import AdminPermissionsPage from './pages/AdminPermissionsPage';
import AdminRolePermissionsPage from './pages/AdminRolePermissionsPage';
import AdminUserRolesPage from './pages/AdminUserRolesPage';
import AdminContactUsPage from './pages/AdminContactUsPage';

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <LoginPage />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<MoviesPage />} />
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin CRUD routes */}
          <Route path="/admin/movies" element={<AdminMoviesPage />} />
          <Route path="/admin/languages" element={<AdminLanguagesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/roles" element={<AdminRolesPage />} />
          <Route path="/admin/permissions" element={<AdminPermissionsPage />} />
          <Route path="/admin/role-permissions" element={<AdminRolePermissionsPage />} />
          <Route path="/admin/user-roles" element={<AdminUserRolesPage />} />
          <Route path="/admin/contact-us" element={<AdminContactUsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavouritesProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </FavouritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
