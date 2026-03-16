import React from 'react';
import CrudPage from '../components/CrudPage';
import { userService } from '../services/api';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phonenumber', label: 'Phone' },
  { key: 'is_active', label: 'Status', render: (v) => (
    <span className={`badge ${v ? 'badge-active' : 'badge-inactive'}`}>
      {v ? 'Active' : 'Inactive'}
    </span>
  )},
  { key: 'created_at', label: 'Created' },
];

const formFields = [
  { key: 'name', label: 'Full Name', required: true, placeholder: 'Joe Soap' },
  { key: 'email', label: 'Email', required: true, type: 'email', placeholder: 'j.doe@aglet.co.za' },
  { key: 'password', label: 'Password', required: true, type: 'password' },
  { key: 'phonenumber', label: 'Phone Number', required: true, placeholder: '0847654321' },
];

export default function AdminUsersPage() {
  return (
    <CrudPage
      title="Users"
      subtitle="Manage user accounts"
      service={userService}
      columns={columns}
      formFields={formFields}
    />
  );
}
