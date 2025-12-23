import './Page.css';

export function ProductsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Products</h1>
        <p>Manage your product catalog</p>
      </div>

      <div className="page-content">
        <div className="info-box">
          <h3>🧴 Product Catalog</h3>
          <p>
            This page will allow you to:
          </p>
          <ul style={{ color: '#aaa', lineHeight: '1.8', marginLeft: '1.5rem' }}>
            <li>View all your products with performance metrics</li>
            <li>Add new products to your catalog</li>
            <li>Edit product details, pricing, and inventory</li>
            <li>Manage product images and descriptions</li>
            <li>Track product approval status</li>
          </ul>
          <p className="info-note">
            <strong>Integration:</strong> Uses Vendure product API<br />
            <strong>Next:</strong> Build product management UI
          </p>
        </div>
      </div>
    </div>
  );
}
