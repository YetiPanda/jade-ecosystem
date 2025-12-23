import './Page.css';

export function ProfilePage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Brand Profile</h1>
        <p>Manage your brand identity, values, and certifications</p>
      </div>

      <div className="page-content">
        <div className="info-box">
          <h3>📝 Brand Profile Management</h3>
          <p>
            This page will allow you to manage your vendor profile including:
          </p>
          <ul style={{ color: '#aaa', lineHeight: '1.8', marginLeft: '1.5rem' }}>
            <li>Brand name, tagline, and story</li>
            <li>Visual identity (logo, hero image, colors)</li>
            <li>Social links and contact information</li>
            <li>Brand values (organic, vegan, woman-founded, etc.)</li>
            <li>Certifications (USDA Organic, Leaping Bunny, B Corp, etc.)</li>
          </ul>
          <p className="info-note">
            <strong>Sprint A.1:</strong> Database schema complete.<br />
            <strong>Next:</strong> Build profile form components (Sprint B.3)
          </p>
        </div>
      </div>
    </div>
  );
}
