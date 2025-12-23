import './Page.css';

export function SettingsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="page-content">
        <div className="info-box">
          <h3>⚙️ Account Settings</h3>
          <p>
            This page will allow you to configure:
          </p>
          <ul style={{ color: '#aaa', lineHeight: '1.8', marginLeft: '1.5rem' }}>
            <li>Account information and contact details</li>
            <li>Email notification preferences</li>
            <li>Password and security settings</li>
            <li>Billing and payment information</li>
            <li>User management (if multi-user accounts)</li>
            <li>API keys and integrations</li>
          </ul>
          <p className="info-note">
            <strong>Future Enhancement:</strong> Settings management<br />
            <strong>Priority:</strong> Lower priority, build after core features
          </p>
        </div>
      </div>
    </div>
  );
}
