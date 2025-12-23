import React from 'react';
import { Link } from 'react-router-dom';
const NotFoundPage = () => (
  <div className="text-center py-16">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <Link to="/" className="text-primary hover:underline">Go Home</Link>
  </div>
);
export default NotFoundPage;
