import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // TODO: Replace with actual authentication API call
    // For now, use mock authentication
    if (email && password) {
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser = {
        id: '1',
        companyName: 'Demo Skincare Co.',
        contactEmail: email,
        isVerified: true,
      };

      login(mockToken, mockUser);
      navigate('/dashboard');
    } else {
      setError('Please enter both email and password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>JADE Vendor Portal</h1>
          <p>Sign in to your vendor account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vendor@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>

          <div className="login-footer">
            <a href="#" className="link">
              Forgot password?
            </a>
            <span> • </span>
            <a href="#" className="link">
              Apply to become a vendor
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
