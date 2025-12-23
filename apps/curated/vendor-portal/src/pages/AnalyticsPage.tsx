import './Page.css';

export function AnalyticsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Discover how spas find and engage with your brand</p>
      </div>

      <div className="page-content">
        <div className="info-box">
          <h3>📈 Discovery & Performance Analytics</h3>
          <p>
            This page will provide insights into:
          </p>
          <ul style={{ color: '#aaa', lineHeight: '1.8', marginLeft: '1.5rem' }}>
            <li>Discovery sources (search, recommendations, values filters)</li>
            <li>Search queries that lead spas to your products</li>
            <li>Values-based performance (which values drive traffic)</li>
            <li>Product performance metrics over time</li>
            <li>Spa relationship analytics</li>
            <li>Visibility score and optimization suggestions</li>
          </ul>
          <p className="info-note">
            <strong>Sprint D.1-D.3:</strong> Discovery Analytics (Weeks 11-12)<br />
            <strong>Database:</strong> discovery_impressions table ready<br />
            <strong>GraphQL:</strong> discoveryAnalytics query defined
          </p>
        </div>
      </div>
    </div>
  );
}
