import React from 'react';
import CrudPage from '../components/CrudPage';
import { permissionService } from '../services/api';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Permission Name' },
  { key: 'description', label: 'Description' },
  { key: 'is_active', label: 'Status', render: (v) => (
    <span className={`badge ${v ? 'badge-active' : 'badge-inactive'}`}>
      {v ? 'Active' : 'Inactive'}
    </span>
  )},
  { key: 'created_at', label: 'Created' },
];

const formFields = [
  { key: 'name', label: 'Permission Name', required: true, placeholder: 'Admin' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'What the permission is about' },
];

export default function AdminPermissionsPage() {
  return (
    <CrudPage
      title="Permissions"
      subtitle="Manage application permissions"
      service={permissionService}
      columns={columns}
      formFields={formFields}
    />
  );
}
