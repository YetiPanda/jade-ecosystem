import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Upload,
  Save,
  X,
  Package,
  DollarSign,
  Tag,
  Star,
  TrendingUp,
  AlertCircle,
  Copy,
  Pause,
  Play,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useProductsForDashboard } from '../../../hooks/dashboard';
import { useProductMutations } from '../../../hooks/dashboard/useProductMutations';
import { toast } from 'sonner';

export function ProductManagement() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // Inline editing state
  const [editingProduct, setEditingProduct] = useState<{productId: string, field: 'price' | 'wholesalePrice' | 'stock'} | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Performance metrics expansion state
  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set());

  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    wholesalePrice: '',
    minOrderQty: '',
    ingredients: '',
    instructions: '',
    image: null as File | null
  });

  // Fetch real product data from API
  const { products: apiProducts, loading, error, refetch } = useProductsForDashboard({
    searchTerm: searchTerm || undefined,
    category: filterCategory !== 'all' ? filterCategory : undefined,
  });

  // Get product mutations
  const { createProduct, updateProduct, deleteProduct, updateProductVariant, loading: mutationLoading } = useProductMutations();

  // Mock products using actual Circadia product images as fallback
  const mockProducts = [
    {
      id: 'mock-1',
      variantId: 'variant-mock-1',
      name: 'Vitamin C Reversal Serum',
      brand: 'Circadia',
      category: 'Treatment Serums',
      price: 89.00,
      wholesalePrice: 62.30,
      stock: 45,
      status: 'active',
      rating: 4.8,
      reviews: 124,
      sold: 342,
      image: '/assets/products/Circadia/VITAMIN_C_REVERSAL_SERUM_34b76eca-5b54-4d45-90be-a91ccc96371c.webp',
      // Performance metrics
      performance: {
        views: 1247,
        clicks: 423,
        conversionRate: 27.4,
        revenue: 30438,
        viewTrend: 'up' as const,
        clickTrend: 'up' as const,
        revenueTrend: 'up' as const,
      },
    },
    {
      id: 'mock-2',
      variantId: 'variant-mock-2',
      name: 'Aquaporin Hydrating Cream',
      brand: 'Circadia',
      category: 'Moisturizers',
      price: 74.00,
      wholesalePrice: 51.80,
      stock: 32,
      status: 'active',
      rating: 4.9,
      reviews: 203,
      sold: 567,
      image: '/assets/products/Circadia/aquaporin-hydrating-cream-circadia-1.webp',
      // Performance metrics
      performance: {
        views: 2134,
        clicks: 687,
        conversionRate: 32.2,
        revenue: 41958,
        viewTrend: 'up' as const,
        clickTrend: 'up' as const,
        revenueTrend: 'up' as const,
      },
    },
    {
      id: 'mock-3',
      variantId: 'variant-mock-3',
      name: 'Micro-Exfoliating Honey Cleanser',
      brand: 'Circadia',
      category: 'Cleansers',
      price: 42.00,
      wholesalePrice: 29.40,
      stock: 15,
      status: 'low-stock',
      rating: 4.7,
      reviews: 156,
      sold: 428,
      image: '/assets/products/Circadia/MICRO-EXFOLIATING_HONEY_CLEANSER.webp',
      // Performance metrics
      performance: {
        views: 892,
        clicks: 312,
        conversionRate: 35.0,
        revenue: 17976,
        viewTrend: 'stable' as const,
        clickTrend: 'up' as const,
        revenueTrend: 'stable' as const,
      },
    },
    {
      id: 'mock-4',
      variantId: 'variant-mock-4',
      name: 'Light Day Sunscreen',
      brand: 'Circadia',
      category: 'Treatment Serums',
      price: 52.00,
      wholesalePrice: 36.40,
      stock: 28,
      status: 'active',
      rating: 4.6,
      reviews: 89,
      sold: 234,
      image: '/assets/products/Circadia/LIGHT_DAY_SUNSCREEN.webp',
      // Performance metrics
      performance: {
        views: 673,
        clicks: 189,
        conversionRate: 28.1,
        revenue: 12168,
        viewTrend: 'down' as const,
        clickTrend: 'down' as const,
        revenueTrend: 'down' as const,
      },
    },
    {
      id: 'mock-5',
      variantId: 'variant-mock-5',
      name: 'Chrono-Calm Facial Serum',
      brand: 'Circadia',
      category: 'Active Serums',
      price: 95.00,
      wholesalePrice: 66.50,
      stock: 8,
      status: 'low-stock',
      rating: 4.9,
      reviews: 167,
      sold: 298,
      image: '/assets/products/Circadia/CHRONO-CALM_FACIAL_SERUM.webp',
      // Performance metrics
      performance: {
        views: 1456,
        clicks: 478,
        conversionRate: 32.8,
        revenue: 28310,
        viewTrend: 'up' as const,
        clickTrend: 'stable' as const,
        revenueTrend: 'up' as const,
      },
    },
    {
      id: 'mock-6',
      variantId: 'variant-mock-6',
      name: 'Amandola Milk Cleanser',
      brand: 'Circadia',
      category: 'Cleansers',
      price: 38.00,
      wholesalePrice: 26.60,
      stock: 0,
      status: 'out-of-stock',
      rating: 4.5,
      reviews: 142,
      sold: 519,
      image: '/assets/products/Circadia/AMANDOLA_MILK_CLEANSER_87b7fa0c-552a-4787-994b-eeba1bbd7dc9.webp',
      // Performance metrics
      performance: {
        views: 1823,
        clicks: 592,
        conversionRate: 32.5,
        revenue: 19722,
        viewTrend: 'down' as const,
        clickTrend: 'down' as const,
        revenueTrend: 'down' as const,
      },
    },
  ];

  // Use API products or fallback to mock data if error
  const products = error ? mockProducts : (apiProducts || []);

  const categories = [
    'Treatment Serums',
    'Active Serums',
    'Moisturizers',
    'Cleansers',
    'Medical Injectables',
    'Equipment',
    'Tools & Accessories'
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-[#114538] bg-[#aaaa8a]';
      case 'low-stock': return 'text-[#958673] bg-[#ded7c9]';
      case 'out-of-stock': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProduct({
        name: newProduct.name,
        brand: newProduct.brand,
        category: newProduct.category,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        wholesalePrice: parseFloat(newProduct.wholesalePrice),
        minOrderQty: parseInt(newProduct.minOrderQty),
        ingredients: newProduct.ingredients,
        instructions: newProduct.instructions,
        enabled: true,
      });

      // Reset form and close modal
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        brand: '',
        category: '',
        description: '',
        price: '',
        wholesalePrice: '',
        minOrderQty: '',
        ingredients: '',
        instructions: '',
        image: null
      });

      // Refetch products to show new one
      refetch();
    } catch (error) {
      // Error is already handled in the mutation hook with toast
      console.error('Failed to create product:', error);
    }
  };

  // Bulk selection handlers
  const toggleProductSelection = (productId: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
  };

  const selectAll = () => {
    setSelectedProducts(new Set(filteredProducts.map(p => String(p.id))));
  };

  const clearSelection = () => {
    setSelectedProducts(new Set());
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedProducts.size} products?`)) return;

    const productIds = Array.from(selectedProducts);
    let successCount = 0;
    let failCount = 0;

    try {
      // Delete products one by one (Vendure doesn't have bulk delete)
      for (const productId of productIds) {
        try {
          await deleteProduct(productId);
          successCount++;
        } catch (error) {
          console.error(`Failed to delete product ${productId}:`, error);
          failCount++;
        }
      }

      // Show summary
      if (successCount > 0) {
        toast.success(`Deleted ${successCount} product${successCount > 1 ? 's' : ''}`);
      }
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} product${failCount > 1 ? 's' : ''}`);
      }

      clearSelection();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete products');
    }
  };

  const handleBulkPause = async () => {
    const productIds = Array.from(selectedProducts);
    let successCount = 0;
    let failCount = 0;

    try {
      // Pause products by setting enabled: false
      for (const productId of productIds) {
        try {
          await updateProduct({
            id: productId,
            enabled: false,
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to pause product ${productId}:`, error);
          failCount++;
        }
      }

      // Show summary
      if (successCount > 0) {
        toast.success(`Paused ${successCount} product${successCount > 1 ? 's' : ''}`);
      }
      if (failCount > 0) {
        toast.error(`Failed to pause ${failCount} product${failCount > 1 ? 's' : ''}`);
      }

      clearSelection();
    } catch (error) {
      console.error('Bulk pause error:', error);
      toast.error('Failed to pause products');
    }
  };

  const handleBulkActivate = async () => {
    const productIds = Array.from(selectedProducts);
    let successCount = 0;
    let failCount = 0;

    try {
      // Activate products by setting enabled: true
      for (const productId of productIds) {
        try {
          await updateProduct({
            id: productId,
            enabled: true,
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to activate product ${productId}:`, error);
          failCount++;
        }
      }

      // Show summary
      if (successCount > 0) {
        toast.success(`Activated ${successCount} product${successCount > 1 ? 's' : ''}`);
      }
      if (failCount > 0) {
        toast.error(`Failed to activate ${failCount} product${failCount > 1 ? 's' : ''}`);
      }

      clearSelection();
    } catch (error) {
      console.error('Bulk activate error:', error);
      toast.error('Failed to activate products');
    }
  };

  // Inline editing handlers
  const startEditing = (productId: string, field: 'price' | 'wholesalePrice' | 'stock', currentValue: number) => {
    setEditingProduct({ productId, field });
    setEditValue(String(currentValue));
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editingProduct) return;

    const { productId, field } = editingProduct;
    const numericValue = field === 'stock' ? parseInt(editValue) : parseFloat(editValue);

    if (isNaN(numericValue) || numericValue < 0) {
      toast.error(`Invalid ${field} value`);
      return;
    }

    // Find the product to get its variantId
    const product = products.find(p => String(p.id) === productId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    // Check if product has variantId (real API products have it, some mocks might not)
    if (!('variantId' in product) || !product.variantId) {
      toast.error('Product variant not available');
      return;
    }

    try {
      // Build update data based on field being edited
      const updateData: any = {
        variantId: product.variantId,
      };

      if (field === 'price') {
        updateData.price = numericValue;
      } else if (field === 'wholesalePrice') {
        updateData.wholesalePrice = numericValue;
      } else if (field === 'stock') {
        updateData.stockLevel = numericValue;
      }

      // Call GraphQL mutation
      await updateProductVariant(updateData);

      // Success toast is shown by the mutation hook
      cancelEditing();
    } catch (error) {
      // Error toast is shown by the mutation hook
      console.error('Failed to update product:', error);
    }
  };

  // Performance metrics expansion handler
  const toggleMetrics = (productId: string) => {
    const newExpanded = new Set(expandedMetrics);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedMetrics(newExpanded);
  };

  // Helper function to render trend icon
  const renderTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') {
      return <ArrowUp className="h-3 w-3 text-green-600" />;
    } else if (trend === 'down') {
      return <ArrowDown className="h-3 w-3 text-red-600" />;
    }
    return <Minus className="h-3 w-3 text-gray-400" />;
  };

  // Show loading state only if we don't have products yet
  if (loading && products.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-pulse" />
          <h2 className="text-xl font-light text-muted-foreground">Loading products...</h2>
        </div>
      </div>
    );
  }

  // Show error state only if we don't have products (no mock data fallback)
  if (error && products.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-terracotta mb-4" />
          <h2 className="text-xl font-light text-muted-foreground mb-2">Error loading products</h2>
          <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light mb-2">Product Management</h1>
          <p className="text-muted-foreground font-light">
            Add, edit, and manage your product catalog
          </p>
        </div>
        
        <Button 
          onClick={() => setShowAddProduct(true)}
          className="rounded-full px-6"
          style={{backgroundColor: '#30B7D2', color: '#ffffff'}}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Add Product Modal/Form */}
      {showAddProduct && (
        <Card className="border-subtle shadow-warm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-normal">Add New Product</CardTitle>
                <CardDescription className="font-light">
                  Fill in the details to add a product to your catalog
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowAddProduct(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="rounded-full border-subtle"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={newProduct.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="rounded-full border-subtle"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="rounded-full border-subtle">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Retail Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="rounded-full border-subtle"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wholesalePrice">Wholesale Price *</Label>
                  <Input
                    id="wholesalePrice"
                    type="number"
                    step="0.01"
                    value={newProduct.wholesalePrice}
                    onChange={(e) => handleInputChange('wholesalePrice', e.target.value)}
                    className="rounded-full border-subtle"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description *</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed product description for spa professionals..."
                  className="min-h-[100px] border-subtle"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Key Ingredients</Label>
                <Textarea
                  id="ingredients"
                  value={newProduct.ingredients}
                  onChange={(e) => handleInputChange('ingredients', e.target.value)}
                  placeholder="List the key active ingredients..."
                  className="min-h-[80px] border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Usage Instructions</Label>
                <Textarea
                  id="instructions"
                  value={newProduct.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  placeholder="How to use this product in spa treatments..."
                  className="min-h-[80px] border-subtle"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minOrderQty">Minimum Order Quantity</Label>
                  <Input
                    id="minOrderQty"
                    type="number"
                    value={newProduct.minOrderQty}
                    onChange={(e) => handleInputChange('minOrderQty', e.target.value)}
                    className="rounded-full border-subtle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="border-subtle"
                    />
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddProduct(false)}>
                  Cancel
                </Button>
                <Button type="submit" style={{backgroundColor: '#30B7D2', color: '#ffffff'}}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80 rounded-full border-subtle"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48 rounded-full border-subtle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 rounded-full border-subtle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          {selectedProducts.size > 0 && (
            <Badge variant="outline" style={{borderColor: '#30B7D2', color: '#30B7D2'}}>
              {selectedProducts.size} selected
            </Badge>
          )}
          <Badge variant="outline" style={{borderColor: '#958673', color: '#958673'}}>
            {filteredProducts.length} products
          </Badge>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedProducts.size > 0 && (
        <Card className="border-subtle shadow-warm" style={{borderColor: '#30B7D2'}}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={selectAll} className="rounded-full">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Select All ({filteredProducts.length})
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection} className="rounded-full">
                  <X className="h-4 w-4 mr-2" />
                  Clear Selection
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkActivate}
                  className="rounded-full"
                  style={{borderColor: '#aaaa8a', color: '#114538'}}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkPause}
                  className="rounded-full"
                  style={{borderColor: '#958673', color: '#958673'}}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="rounded-full"
                  style={{borderColor: '#dc2626', color: '#dc2626'}}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedProducts.size})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="border-subtle shadow-warm overflow-hidden">
            <div className="aspect-square bg-accent/30 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Selection Checkbox */}
              <div className="absolute top-3 left-3">
                <Checkbox
                  checked={selectedProducts.has(String(product.id))}
                  onCheckedChange={() => toggleProductSelection(String(product.id))}
                  className="h-5 w-5 bg-white border-2 rounded"
                />
              </div>
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <Badge className={getStatusColor(product.status)}>
                  {product.status === 'active' ? 'Active' :
                   product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.brand} • {product.category}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 fill-current" style={{color: '#958673'}} />
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    {/* Retail Price - Inline Editable */}
                    {editingProduct?.productId === String(product.id) && editingProduct?.field === 'price' ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-6 w-16 text-xs px-1"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                        <Button size="sm" onClick={saveEdit} className="h-6 w-6 p-0">
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditing} className="h-6 w-6 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="font-medium cursor-pointer hover:bg-accent px-1 rounded flex items-center justify-end group"
                        onClick={() => startEditing(String(product.id), 'price', product.price)}
                        title="Click to edit price"
                      >
                        ${product.price}
                        <Edit className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-50" />
                      </div>
                    )}

                    {/* Wholesale Price - Inline Editable */}
                    {editingProduct?.productId === String(product.id) && editingProduct?.field === 'wholesalePrice' ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-muted-foreground">W:</span>
                        <span className="text-xs">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-6 w-16 text-xs px-1"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                        <Button size="sm" onClick={saveEdit} className="h-6 w-6 p-0">
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditing} className="h-6 w-6 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="text-muted-foreground cursor-pointer hover:bg-accent px-1 rounded flex items-center justify-end group"
                        onClick={() => startEditing(String(product.id), 'wholesalePrice', product.wholesalePrice)}
                        title="Click to edit wholesale price"
                      >
                        Wholesale: ${product.wholesalePrice}
                        <Edit className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-50" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    {/* Stock - Inline Editable */}
                    {editingProduct?.productId === String(product.id) && editingProduct?.field === 'stock' ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-muted-foreground">Stock:</span>
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-6 w-16 text-xs px-1"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                        <Button size="sm" onClick={saveEdit} className="h-6 w-6 p-0">
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditing} className="h-6 w-6 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer hover:bg-accent px-1 rounded inline-flex items-center group"
                        onClick={() => startEditing(String(product.id), 'stock', product.stock)}
                        title="Click to edit stock"
                      >
                        <span className="text-muted-foreground">Stock:</span>
                        <span className={`ml-2 font-medium ${
                          product.stock === 0 ? 'text-red-600' :
                          product.stock < 20 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {product.stock}
                        </span>
                        <Edit className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-50" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sold:</span>
                    <span className="ml-2 font-medium">{product.sold}</span>
                  </div>
                </div>

                {/* Performance Metrics Section */}
                {'performance' in product && product.performance && (
                  <div className="border-t border-subtle pt-3">
                    <button
                      onClick={() => toggleMetrics(String(product.id))}
                      className="w-full flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Performance Metrics</span>
                      </div>
                      {expandedMetrics.has(String(product.id)) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {expandedMetrics.has(String(product.id)) && (
                      <div className="mt-3 space-y-3 text-xs">
                        {/* Views */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Views</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{product.performance.views.toLocaleString()}</span>
                            {renderTrendIcon(product.performance.viewTrend)}
                          </div>
                        </div>

                        {/* Clicks */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Package className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Clicks</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{product.performance.clicks.toLocaleString()}</span>
                            {renderTrendIcon(product.performance.clickTrend)}
                          </div>
                        </div>

                        {/* Conversion Rate */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Conversion</span>
                          </div>
                          <span className="font-medium">{product.performance.conversionRate}%</span>
                        </div>

                        {/* Revenue */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Revenue</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">${product.performance.revenue.toLocaleString()}</span>
                            {renderTrendIcon(product.performance.revenueTrend)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full" title="Duplicate product">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}