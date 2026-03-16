import React from 'react';
import CrudPage from '../components/CrudPage';
import { userRoleService } from '../services/api';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'role_id', label: 'Role ID' },
  { key: 'user_id', label: 'User ID' },
  { key: 'is_active', label: 'Status', render: (v) => (
    <span className={`badge ${v ? 'badge-active' : 'badge-inactive'}`}>
      {v ? 'Active' : 'Inactive'}
    </span>
  )},
  { key: 'created_at', label: 'Created' },
];

const formFields = [
  { key: 'role_id', label: 'Role ID', required: true, type: 'number' },
  { key: 'user_id', label: 'User ID', required: true, type: 'number' },
];

export default function AdminUserRolesPage() {
  return (
    <CrudPage
      title="User Roles"
      subtitle="Manage user-role assignments"
      service={userRoleService}
      columns={columns}
      formFields={formFields}
    />
  );
}
