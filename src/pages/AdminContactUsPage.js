import React from 'react';
import CrudPage from '../components/CrudPage';
import { contactUsService } from '../services/api';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone_number', label: 'Phone' },
  { key: 'company_name', label: 'Company' },
  { key: 'is_actioned', label: 'Actioned', render: (v) => (
    <span className={`badge ${v ? 'badge-active' : 'badge-inactive'}`}>
      {v ? 'Yes' : 'No'}
    </span>
  )},
  { key: 'created_at', label: 'Created' },
];

const formFields = [
  { key: 'name', label: 'Name', required: true },
  { key: 'email', label: 'Email', required: true, type: 'email' },
  { key: 'phone_number', label: 'Phone Number', required: true },
  { key: 'company_name', label: 'Company Name', required: true },
  { key: 'message', label: 'Message', required: true, type: 'textarea' },
];

export default function AdminContactUsPage() {
  return (
    <CrudPage
      title="Contact Submissions"
      subtitle="View and manage contact us enquiries"
      service={contactUsService}
      columns={columns}
      formFields={formFields}
    />
  );
}
