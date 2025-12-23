import { ProductMetric, formatCurrency } from '../types/dashboard';
import './SpaLeaderboard.css';

export interface ProductPerformanceTableProps {
  data: ProductMetric[];
  loading?: boolean;
  error?: Error;
  limit?: number;
}

export function ProductPerformanceTable({
  data,
  loading,
  error,
  limit = 10,
}: ProductPerformanceTableProps) {
  if (loading) {
    return <ProductPerformanceTableSkeleton />;
  }

  if (error) {
    return (
      <div className="table-container">
        <div className="table-error">
          <p>Failed to load product performance data</p>
          <p className="table-error-detail">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-container">
        <div className="table-empty">
          <p>No product data available</p>
        </div>
      </div>
    );
  }

  const displayData = data.slice(0, limit);

  return (
    <div className="table-container">
      <div className="table-header">
        <h3 className="table-title">Top Products</h3>
        <p className="table-subtitle">Best performing products by revenue</p>
      </div>

      <div className="table-wrapper">
        <table className="spa-leaderboard-table">
          <thead>
            <tr>
              <th className="col-rank">#</th>
              <th className="col-product-name">Product Name</th>
              <th className="col-revenue">Revenue</th>
              <th className="col-units">Units Sold</th>
              <th className="col-spas">Unique Spas</th>
              <th className="col-avg-price">Avg Price</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((product, index) => {
              const avgPrice =
                product.unitsSold > 0 ? product.revenue / product.unitsSold : 0;

              return (
                <tr key={product.productId} className="product-row">
                  <td className="col-rank">
                    <span className="rank-badge">{index + 1}</span>
                  </td>
                  <td className="col-product-name">
                    <div className="product-name-cell">
                      <span className="product-name">{product.productName}</span>
                      <span className="product-id">ID: {product.productId}</span>
                    </div>
                  </td>
                  <td className="col-revenue">
                    <strong>{formatCurrency(product.revenue)}</strong>
                  </td>
                  <td className="col-units">
                    <span className="units-badge">{product.unitsSold}</span>
                  </td>
                  <td className="col-spas">
                    <div className="spas-cell">
                      <span className="spas-count">{product.uniqueSpas}</span>
                      <span className="spas-label">spas</span>
                    </div>
                  </td>
                  <td className="col-avg-price">
                    <span className="avg-price">{formatCurrency(avgPrice)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.length > limit && (
        <div className="table-footer">
          <p className="table-footer-text">
            Showing {limit} of {data.length} products
          </p>
        </div>
      )}
    </div>
  );
}

function ProductPerformanceTableSkeleton() {
  return (
    <div className="table-container">
      <div className="table-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-subtitle" />
      </div>
      <div className="table-skeleton">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton skeleton-row" />
        ))}
      </div>
    </div>
  );
}
