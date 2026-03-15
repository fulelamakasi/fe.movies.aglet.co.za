import React, { useState } from 'react';
import { contactUsService } from '../services/api';
import { MdSend, MdEmail, MdPhone, MdBusiness } from 'react-icons/md';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone_number: '', company_name: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await contactUsService.create(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone_number: '', company_name: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="contact-page">
        <div>
          {success && <div className="alert alert-success">Your message has been sent successfully! We'll be in touch.</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                className="form-control"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.co.za"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                className="form-control"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="0847654321"
                required
              />
            </div>

            <div className="form-group">
              <label>Company Name *</label>
              <input
                className="form-control"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Your Company"
                required
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                className="form-control"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what you need..."
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              <MdSend />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h3>Get In Touch</h3>
          <p>
            Have questions about our movie database platform? Want to report an issue or suggest a feature?
            Fill out the form and our team will get back to you within 24 hours.
          </p>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius)',
                background: 'var(--accent-glow)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '1.2rem'
              }}>
                <MdEmail />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Email</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>info@aglet.co.za</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius)',
                background: 'var(--accent-glow)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '1.2rem'
              }}>
                <MdPhone />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Phone</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>+27 11 000 0000</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius)',
                background: 'var(--accent-glow)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '1.2rem'
              }}>
                <MdBusiness />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Office</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Johannesburg, South Africa</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
