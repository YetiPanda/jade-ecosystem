/**
 * Product Detail Page
 *
 * Displays full product information with progressive disclosure
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductWithFullDetailsQuery } from '../../graphql/generated';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressiveDisclosure } from '../../components/products/ProgressiveDisclosure';
import { SimilarProducts } from '../../components/products/SimilarProducts';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useGetProductWithFullDetailsQuery({
    variables: { id: id! },
    skip: !id,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Product Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {error?.message || 'The product you are looking for does not exist.'}
            </p>
            <Link to="/app/products">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const product = data.product;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/app/products">
          <Button variant="ghost" size="sm">
            ← Back to Products
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Product Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Product ID</label>
                <p className="text-gray-900 font-mono text-sm">{product.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Vendure Product ID</label>
                <p className="text-gray-900 font-mono text-sm">{product.vendureProductId}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Created</label>
                <p className="text-gray-900">
                  {new Date(product.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="text-gray-900">
                  {new Date(product.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Vector Status Inline */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700 block mb-2">Vector Search Status</label>
              <div className="flex gap-3">
                {product.tensorGenerated ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Tensor (13D) ✓
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                    Tensor Pending
                  </span>
                )}
                {product.embeddingGenerated ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Embedding (792D) ✓
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                    Embedding Pending
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progressive Disclosure Component */}
        <ProgressiveDisclosure product={product} />

        {/* Similar Products Component - FR-049 */}
        <SimilarProducts
          currentProductId={product.id}
          tensorGenerated={product.tensorGenerated}
          embeddingGenerated={product.embeddingGenerated}
          limit={6}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
