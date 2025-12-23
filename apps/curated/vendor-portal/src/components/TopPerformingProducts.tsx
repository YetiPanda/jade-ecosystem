import { ProductPerformance, formatRate } from '../types/discovery';
import { formatCurrency } from '../types/dashboard';
import './TopPerformingProducts.css';

export interface TopPerformingProductsProps {
  products: ProductPerformance[];
  loading?: boolean;
}

export function TopPerformingProducts({ products, loading }: TopPerformingProductsProps) {
  if (loading) {
    return <TopPerformingProductsSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="top-products-container">
        <div className="products-header">
          <h3>Top Performing Products</h3>
        </div>
        <div className="products-empty">
          <p>No product data available for this period.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="top-products-container">
      <div className="products-header">
        <h3>Top Performing Products</h3>
        <div className="products-count">{products.length} products</div>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th className="col-rank">#</th>
              <th className="col-product">Product</th>
              <th className="col-impressions">Impressions</th>
              <th className="col-clicks">Clicks</th>
              <th className="col-ctr">CTR</th>
              <th className="col-orders">Orders</th>
              <th className="col-revenue">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.productId} className="product-row">
                <td className="col-rank">
                  <div className="rank-badge">{index + 1}</div>
                </td>
                <td className="col-product">
                  <div className="product-info">
                    {product.productImage && (
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="product-image"
                      />
                    )}
                    <div className="product-name">{product.productName}</div>
                  </div>
                </td>
                <td className="col-impressions">
                  <div className="metric-value">{product.impressions.toLocaleString()}</div>
                  {product.impressionRank <= 3 && (
                    <div className="rank-indicator">Top {product.impressionRank}</div>
                  )}
                </td>
                <td className="col-clicks">
                  <div className="metric-value">{product.clicks.toLocaleString()}</div>
                </td>
                <td className="col-ctr">
                  <div className="ctr-badge" data-level={getCTRLevel(product.clickThroughRate)}>
                    {formatRate(product.clickThroughRate)}
                  </div>
                </td>
                <td className="col-orders">
                  <div className="metric-value">{product.orders.toLocaleString()}</div>
                </td>
                <td className="col-revenue">
                  <div className="revenue-value">{formatCurrency(product.revenue)}</div>
                  {product.revenueRank <= 3 && (
                    <div className="rank-indicator revenue">Top {product.revenueRank}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getCTRLevel(ctr: number): string {
  if (ctr >= 5) return 'high';
  if (ctr >= 2) return 'medium';
  return 'low';
}

function TopPerformingProductsSkeleton() {
  return (
    <div className="top-products-container skeleton-container">
      <div className="products-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-count" />
      </div>
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th className="col-rank">#</th>
              <th className="col-product">Product</th>
              <th className="col-impressions">Impressions</th>
              <th className="col-clicks">Clicks</th>
              <th className="col-ctr">CTR</th>
              <th className="col-orders">Orders</th>
              <th className="col-revenue">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="product-row">
                <td className="col-rank">
                  <div className="skeleton skeleton-rank" />
                </td>
                <td className="col-product">
                  <div className="product-info">
                    <div className="skeleton skeleton-image" />
                    <div className="skeleton skeleton-name" />
                  </div>
                </td>
                <td className="col-impressions">
                  <div className="skeleton skeleton-metric" />
                </td>
                <td className="col-clicks">
                  <div className="skeleton skeleton-metric" />
                </td>
                <td className="col-ctr">
                  <div className="skeleton skeleton-ctr" />
                </td>
                <td className="col-orders">
                  <div className="skeleton skeleton-metric" />
                </td>
                <td className="col-revenue">
                  <div className="skeleton skeleton-metric" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
