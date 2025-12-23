import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Progress } from '../../ui/progress';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  Filter,
  RefreshCw,
  Plus,
  Truck,
  Clock,
  DollarSign,
  BarChart3,
  CheckCircle,
  Edit,
  ExternalLink
} from 'lucide-react';
import { useInventoryForDashboard, useInventoryMutations, useInventoryStats } from '../../../hooks/dashboard/useInventoryForDashboard';
import { toast } from 'sonner';

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingStock, setEditingStock] = useState<{ id: string; value: number } | null>(null);

  // Fetch real inventory data
  const { inventory: apiInventory, loading, error, refetch } = useInventoryForDashboard({
    status: filterStatus !== 'all' ? filterStatus : undefined,
    searchTerm: searchTerm || undefined,
  });

  const { stats } = useInventoryStats();
  const { updateStock, loading: mutationLoading } = useInventoryMutations();

  // Use real data or empty array
  const inventory = loading || error ? [] : apiInventory.map(item => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    currentStock: item.currentStock,
    minThreshold: item.minStock,
    maxCapacity: item.maxStock,
    cost: item.wholesalePrice,
    lastRestocked: item.lastRestocked?.toISOString().split('T')[0],
    supplier: 'TBD', // Will be added to backend
    status: item.status === 'in-stock' ? 'good' : item.status === 'low-stock' ? 'low' : 'critical',
    image: '', // Will be added with product images
    reorderPoint: item.reorderPoint,
    avgMonthlySales: item.avgDailySales * 30,
    daysOfStock: item.daysOfStock,
    profitMargin: ((item.price - item.wholesalePrice) / item.wholesalePrice) * 100,
  }));

  const handleStockUpdate = async (variantId: string, newStock: number) => {
    try {
      await updateStock(variantId, newStock);
      setEditingStock(null);
      refetch();
    } catch (error) {
      // Error already shown via toast in mutation hook
    }
  };

  // Fallback mock data for development
  const mockInventory = [
    {
      id: 1,
      name: 'HydraFacial Serum - Activ-4',
      sku: 'HFS-ACT4-50ML',
      currentStock: 247,
      minThreshold: 50,
      maxCapacity: 500,
      cost: 42.50,
      lastRestocked: '2024-12-20',
      supplier: 'HydraFacial Corporation',
      status: 'good',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop',
      reorderPoint: 75,
      avgMonthlySales: 89,
      daysOfStock: 67,
      profitMargin: 100
    },
    {
      id: 2,
      name: 'Vitamin C Brightening Serum',
      sku: 'VCS-BRIGHT-30ML',
      currentStock: 23,
      minThreshold: 25,
      maxCapacity: 200,
      cost: 28.50,
      lastRestocked: '2024-12-15',
      supplier: 'SkinCeuticals Labs',
      status: 'low',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop',
      reorderPoint: 30,
      avgMonthlySales: 156,
      daysOfStock: 4,
      profitMargin: 58
    },
    {
      id: 3,
      name: 'Botox 100u Vials',
      sku: 'BTX-100U-VIAL',
      currentStock: 5,
      minThreshold: 10,
      maxCapacity: 50,
      cost: 425.00,
      lastRestocked: '2024-11-30',
      supplier: 'Allergan Pharmaceuticals',
      status: 'critical',
      image: 'https://images.unsplash.com/photo-1585435557343-3b092031fc30?w=100&h=100&fit=crop',
      reorderPoint: 15,
      avgMonthlySales: 12,
      daysOfStock: 12,
      profitMargin: 225
    },
    {
      id: 4,
      name: 'Hyaluronic Acid Moisturizer',
      sku: 'HAM-50ML-TUBE',
      currentStock: 0,
      minThreshold: 30,
      maxCapacity: 300,
      cost: 18.75,
      lastRestocked: '2024-11-15',
      supplier: 'Dermalogica Supply',
      status: 'out-of-stock',
      image: 'https://images.unsplash.com/photo-1556229174-f75fb3c51ec6?w=100&h=100&fit=crop',
      reorderPoint: 40,
      avgMonthlySales: 203,
      daysOfStock: 0,
      profitMargin: 13.25
    }
  ];

  const suppliers = [
    {
      name: 'HydraFacial Corporation',
      products: 12,
      totalValue: '$52,400',
      avgDelivery: '3-5 days',
      rating: 4.9,
      lastOrder: '2024-12-20'
    },
    {
      name: 'SkinCeuticals Labs',
      products: 8,
      totalValue: '$34,200',
      avgDelivery: '5-7 days',
      rating: 4.7,
      lastOrder: '2024-12-15'
    },
    {
      name: 'Allergan Pharmaceuticals',
      products: 3,
      totalValue: '$89,500',
      avgDelivery: '2-3 days',
      rating: 4.8,
      lastOrder: '2024-11-30'
    },
    {
      name: 'Dermalogica Supply',
      products: 15,
      totalValue: '$28,900',
      avgDelivery: '4-6 days',
      rating: 4.6,
      lastOrder: '2024-11-15'
    }
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'low': return 'text-[#958673] bg-[#ded7c9]';
      case 'good': return 'text-[#114538] bg-[#aaaa8a]';
      case 'out-of-stock': return 'text-red-700 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);
  const lowStockItems = inventory.filter(item => item.status === 'critical' || item.status === 'low' || item.status === 'out-of-stock').length;
  const activeProducts = inventory.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light mb-2">Inventory Management</h1>
          <p className="text-muted-foreground font-light">
            Monitor stock levels, manage suppliers, and optimize inventory
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="rounded-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Stock
          </Button>
          <Button className="rounded-full px-6" style={{backgroundColor: '#30B7D2', color: '#ffffff'}}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Total Inventory Value
              </CardTitle>
              <DollarSign className="h-4 w-4" style={{color: '#30B7D2'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">${totalValue.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Across {activeProducts} products</p>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Low Stock Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light text-red-600">{lowStockItems}</div>
            <p className="text-sm text-muted-foreground">Items need attention</p>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Active Suppliers
              </CardTitle>
              <Truck className="h-4 w-4" style={{color: '#114538'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">{suppliers.length}</div>
            <p className="text-sm text-muted-foreground">Verified partners</p>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Avg Margin
              </CardTitle>
              <BarChart3 className="h-4 w-4" style={{color: '#958673'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">68%</div>
            <p className="text-sm text-muted-foreground">Gross profit margin</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80 rounded-full border-subtle"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 rounded-full border-subtle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="good">In Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Table */}
        <div className="lg:col-span-2">
          <Card className="border-subtle shadow-warm">
            <CardHeader>
              <CardTitle className="font-normal">Current Inventory</CardTitle>
              <CardDescription className="font-light">
                Stock levels and supplier information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInventory.map((item) => (
                  <div key={item.id} className="p-4 rounded-lg border border-subtle hover:bg-accent/30 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-accent rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                            <p className="text-xs text-muted-foreground">Supplier: {item.supplier}</p>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status === 'critical' ? 'Critical' : 
                             item.status === 'low' ? 'Low Stock' : 
                             item.status === 'good' ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Current Stock</span>
                            <div className="font-medium">{item.currentStock}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Days of Stock</span>
                            <div className={`font-medium ${item.daysOfStock < 7 ? 'text-red-600' : item.daysOfStock < 14 ? 'text-orange-600' : 'text-green-600'}`}>
                              {item.daysOfStock} days
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Cost</span>
                            <div className="font-medium">${item.cost}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Margin</span>
                            <div className="font-medium">${item.profitMargin}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Stock Level</span>
                            <span>{item.currentStock} / {item.maxCapacity}</span>
                          </div>
                          <Progress 
                            value={(item.currentStock / item.maxCapacity) * 100} 
                            className="h-2"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Last restocked: {item.lastRestocked}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="rounded-full px-4">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              className="rounded-full px-4"
                              style={{backgroundColor: '#30B7D2', color: '#ffffff'}}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Reorder
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suppliers */}
        <div>
          <Card className="border-subtle shadow-warm">
            <CardHeader>
              <CardTitle className="font-normal">Suppliers</CardTitle>
              <CardDescription className="font-light">
                Your supply chain partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suppliers.map((supplier, index) => (
                  <div key={index} className="p-4 rounded-lg border border-subtle hover:bg-accent/30 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{supplier.name}</h4>
                          <p className="text-xs text-muted-foreground">{supplier.products} products</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Total Value</span>
                          <div className="font-medium">{supplier.totalValue}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Delivery</span>
                          <div className="font-medium">{supplier.avgDelivery}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < Math.floor(supplier.rating) ? 'bg-[#958673]' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium">{supplier.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Last: {supplier.lastOrder}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}