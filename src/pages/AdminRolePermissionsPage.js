import React from 'react';
import CrudPage from '../components/CrudPage';
import { rolePermissionService } from '../services/api';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'role_id', label: 'Role ID' },
  { key: 'permission_id', label: 'Permission ID' },
  { key: 'is_active', label: 'Status', render: (v) => (
    <span className={`badge ${v ? 'badge-active' : 'badge-inactive'}`}>
      {v ? 'Active' : 'Inactive'}
    </span>
  )},
  { key: 'created_at', label: 'Created' },
];

const formFields = [
  { key: 'role_id', label: 'Role ID', required: true, type: 'number' },
  { key: 'permission_id', label: 'Permission ID', required: true, type: 'number' },
];

export default function AdminRolePermissionsPage() {
  return (
    <CrudPage
      title="Role Permissions"
      subtitle="Manage role-permission assignments"
      service={rolePermissionService}
      columns={columns}
      formFields={formFields}
    />
  );
}
