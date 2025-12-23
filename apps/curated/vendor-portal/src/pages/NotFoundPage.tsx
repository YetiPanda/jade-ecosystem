import { Link } from 'react-router-dom';
import './Page.css';

export function NotFoundPage() {
  return (
    <div className="page">
      <div className="page-content">
        <div className="info-box" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
          <h3>Page Not Found</h3>
          <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            The page you're looking for doesn't exist.
          </p>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#646cff',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '0.375rem',
              fontWeight: 600,
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
