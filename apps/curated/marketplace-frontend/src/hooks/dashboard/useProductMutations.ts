import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { toast } from 'sonner';

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      slug
      enabled
      variants {
        id
        sku
        price
        stockLevel
        customFields {
          wholesalePrice
          minOrderQty
        }
      }
      customFields {
        brand
      }
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      slug
      enabled
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      result
      message
    }
  }
`;

const UPDATE_PRODUCT_VARIANT = gql`
  mutation UpdateProductVariant($id: ID!, $input: UpdateProductVariantInput!) {
    updateProductVariant(id: $id, input: $input) {
      id
      sku
      price
      stockLevel
      customFields {
        wholesalePrice
        minOrderQty
      }
    }
  }
`;

export interface CreateProductData {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  wholesalePrice: number;
  minOrderQty: number;
  ingredients?: string;
  instructions?: string;
  enabled?: boolean;
}

export interface UpdateProductData {
  id: string;
  name?: string;
  description?: string;
  enabled?: boolean;
  brand?: string;
}

export interface UpdateProductVariantData {
  variantId: string;
  price?: number;
  wholesalePrice?: number;
  stockLevel?: number;
  minOrderQty?: number;
}

/**
 * Hook for product CRUD operations
 *
 * Provides mutations for creating, updating, and deleting products
 * with automatic cache updates and error handling
 */
export function useProductMutations() {
  const [createProductMutation, { loading: creating }] = useMutation(CREATE_PRODUCT);
  const [updateProductMutation, { loading: updating }] = useMutation(UPDATE_PRODUCT);
  const [deleteProductMutation, { loading: deleting }] = useMutation(DELETE_PRODUCT);
  const [updateVariantMutation, { loading: updatingVariant }] = useMutation(UPDATE_PRODUCT_VARIANT);

  const createProduct = useCallback(async (data: CreateProductData) => {
    try {
      const input = {
        name: data.name,
        description: data.description,
        enabled: data.enabled ?? true,
        customFields: {
          brand: data.brand,
          ingredients: data.ingredients,
          instructions: data.instructions,
        },
        // TODO: Add category as facetValueIds once we have facet mapping
      };

      const result = await createProductMutation({
        variables: { input },
        refetchQueries: ['GetProductsForDashboard'],
      });

      // Create variant with pricing
      if (result.data?.createProduct?.id) {
        const productId = result.data.createProduct.id;
        // TODO: Create variant mutation after product creation
        // For now, Vendure auto-creates a default variant
      }

      toast.success('Product created successfully');
      return result.data?.createProduct;
    } catch (error: any) {
      toast.error(`Failed to create product: ${error.message}`);
      throw error;
    }
  }, [createProductMutation]);

  const updateProduct = useCallback(async (data: UpdateProductData) => {
    try {
      const input: any = {};
      if (data.name) input.name = data.name;
      if (data.description) input.description = data.description;
      if (data.enabled !== undefined) input.enabled = data.enabled;
      if (data.brand) {
        input.customFields = { brand: data.brand };
      }

      const result = await updateProductMutation({
        variables: {
          id: data.id,
          input,
        },
        refetchQueries: ['GetProductsForDashboard'],
      });

      toast.success('Product updated successfully');
      return result.data?.updateProduct;
    } catch (error: any) {
      toast.error(`Failed to update product: ${error.message}`);
      throw error;
    }
  }, [updateProductMutation]);

  const deleteProduct = useCallback(async (productId: string) => {
    try {
      const result = await deleteProductMutation({
        variables: { id: productId },
        refetchQueries: ['GetProductsForDashboard'],
        update(cache) {
          // Remove from cache
          cache.evict({ id: `Product:${productId}` });
          cache.gc();
        },
      });

      toast.success('Product deleted successfully');
      return result.data?.deleteProduct;
    } catch (error: any) {
      toast.error(`Failed to delete product: ${error.message}`);
      throw error;
    }
  }, [deleteProductMutation]);

  const updateProductVariant = useCallback(async (data: UpdateProductVariantData) => {
    try {
      const input: any = {};
      if (data.price !== undefined) input.price = Math.round(data.price * 100); // Convert to cents
      if (data.stockLevel !== undefined) input.stockLevel = data.stockLevel;
      if (data.wholesalePrice !== undefined || data.minOrderQty !== undefined) {
        input.customFields = {};
        if (data.wholesalePrice !== undefined) {
          input.customFields.wholesalePrice = Math.round(data.wholesalePrice * 100);
        }
        if (data.minOrderQty !== undefined) {
          input.customFields.minOrderQty = data.minOrderQty;
        }
      }

      const result = await updateVariantMutation({
        variables: {
          id: data.variantId,
          input,
        },
        refetchQueries: ['GetProductsForDashboard'],
      });

      toast.success('Product variant updated successfully');
      return result.data?.updateProductVariant;
    } catch (error: any) {
      toast.error(`Failed to update variant: ${error.message}`);
      throw error;
    }
  }, [updateVariantMutation]);

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductVariant,
    loading: creating || updating || deleting || updatingVariant,
  };
}
