import './Page.css';

export function DashboardPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome to your vendor dashboard</p>
      </div>

      <div className="page-content">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Total Revenue (30d)</div>
            <div className="metric-value">$12,450</div>
            <div className="metric-trend positive">+12% from last month</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Orders (30d)</div>
            <div className="metric-value">47</div>
            <div className="metric-trend positive">+8% from last month</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Active Spas</div>
            <div className="metric-value">23</div>
            <div className="metric-trend neutral">No change</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Reorder Rate</div>
            <div className="metric-value">68%</div>
            <div className="metric-trend positive">+5% from last month</div>
          </div>
        </div>

        <div className="info-box">
          <h3>🚧 Feature in Development</h3>
          <p>
            This dashboard is part of Feature 011: Vendor Portal MVP (Sprint B.1).
            Full analytics, charts, and tables will be implemented next.
          </p>
          <p className="info-note">
            <strong>Next steps:</strong> Implement RevenueChart, OrdersChart, SpaLeaderboard,
            and ProductPerformanceTable components.
          </p>
        </div>
      </div>
    </div>
  );
}
