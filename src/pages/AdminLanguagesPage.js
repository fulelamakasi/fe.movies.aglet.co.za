import React from 'react';
import CrudPage from '../components/CrudPage';
import { languageService } from '../services/api';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'is_active', label: 'Status', render: (v) => (
    <span className={`badge ${v ? 'badge-active' : 'badge-inactive'}`}>
      {v ? 'Active' : 'Inactive'}
    </span>
  )},
  { key: 'created_at', label: 'Created' },
];

const formFields = [
  { key: 'name', label: 'Name', required: true, placeholder: 'English' },
  { key: 'description', label: 'Description', required: true, type: 'textarea' },
];

export default function AdminLanguagesPage() {
  return (
    <CrudPage
      title="Languages"
      subtitle="Manage language records"
      service={languageService}
      columns={columns}
      formFields={formFields}
    />
  );
}
