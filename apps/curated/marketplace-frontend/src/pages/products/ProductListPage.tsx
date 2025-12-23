/**
 * Product List Page
 *
 * Displays all products in a grid layout
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../graphql/generated';
import { Card, CardContent, CardHeader, CardTitle } from '@jade/ui/components';
import { Button } from '@jade/ui/components';

export const ProductListPage: React.FC = () => {
  const { data, loading, error, fetchMore } = useGetProductsQuery({
    variables: { limit: 12, offset: 0 },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">Browse our collection of spa and wellness products</p>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No products found</p>
            <p className="text-gray-500 text-sm">Check back later for new products</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-lg">{product.id.substring(0, 8)}...</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Vendure ID:</span>{' '}
                      {product.vendureProductId}
                    </p>

                    <div className="flex items-center gap-2">
                      {product.tensorGenerated ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Tensor ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          No Tensor
                        </span>
                      )}

                      {product.embeddingGenerated ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Embedding ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          No Embedding
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      Created: {new Date(product.createdAt).toLocaleDateString()}
                    </p>

                    <Link to={`/app/products/${product.id}`} className="block mt-4">
                      <Button variant="primary" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {products.length >= 12 && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  fetchMore({
                    variables: {
                      offset: products.length,
                    },
                  });
                }}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductListPage;
