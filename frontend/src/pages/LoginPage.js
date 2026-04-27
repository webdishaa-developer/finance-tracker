import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ onSwitch }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <span className="logo-icon">₹</span>
        <h1>FinTrack</h1>
        <p>Business Finance Tracker</p>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign In</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            required
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <p className="auth-switch">
        No account?{' '}
        <button className="link-btn" onClick={onSwitch}>
          Register
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
