import React from 'react';
import CrudPage from '../components/CrudPage';
import { roleService } from '../services/api';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Role Name' },
  { key: 'description', label: 'Description' },
  { key: 'is_active', label: 'Status', render: (v) => (
    <span className={`badge ${v ? 'badge-active' : 'badge-inactive'}`}>
      {v ? 'Active' : 'Inactive'}
    </span>
  )},
  { key: 'created_at', label: 'Created' },
];

const formFields = [
  { key: 'name', label: 'Role Name', required: true, placeholder: 'Video Editor' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'What the role is about' },
];

export default function AdminRolesPage() {
  return (
    <CrudPage
      title="Roles"
      subtitle="Manage application roles"
      service={roleService}
      columns={columns}
      formFields={formFields}
    />
  );
}
