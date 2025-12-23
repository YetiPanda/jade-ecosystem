import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  Check, 
  Clock, 
  Search, 
  Filter,
  Eye,
  MessageSquare,
  Download,
  RefreshCw,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useOrdersForDashboard, useFormatCurrency, useFormatRelativeTime } from '../../../hooks/dashboard';
import { useDashboard } from '../../../contexts/DashboardContext';

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const { filters } = useDashboard();
  const { orders: apiOrders, loading, error, refetch } = useOrdersForDashboard({
    status: filterStatus !== 'all' ? filterStatus : undefined,
    dateFrom: filters.dateRange.from,
    dateTo: filters.dateRange.to,
  });

  const formatCurrency = useFormatCurrency();
  const formatRelativeTime = useFormatRelativeTime();

  // Use real orders or empty array if loading/error
  const orders = loading || error ? [] : apiOrders.map(order => ({
    id: order.orderNumber,
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.shippingAddress?.fullName || '',
      address: order.shippingAddress
        ? `${order.shippingAddress.streetLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.postalCode}`
        : '',
    },
    orderDate: order.date.toISOString().split('T')[0],
    status: order.status,
    total: order.total,
    items: order.items, // Will be fetched separately when order details are viewed
  }));

  // Fallback mock orders for development
  const mockOrders = [
    {
      id: 'ORD-2025-001',
      customer: {
        name: 'Luxe Spa & Wellness',
        email: 'orders@luxespawellness.com',
        phone: '(555) 123-4567',
        address: '123 Spa Lane, Beverly Hills, CA 90210'
      },
      orderDate: '2025-01-02',
      status: 'processing',
      total: 1275.00,
      items: [
        {
          name: 'HydraFacial Serum - Activ-4',
          quantity: 15,
          price: 85.00,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop'
        }
      ],
      shipping: {
        method: 'Standard',
        cost: 0,
        estimatedDelivery: '2025-01-06'
      },
      payment: {
        method: 'Net 30',
        status: 'pending'
      }
    },
    {
      id: 'ORD-2025-002',
      customer: {
        name: 'Elite MedSpa',
        email: 'purchasing@elitemedspa.com',
        phone: '(555) 987-6543',
        address: '456 Medical Plaza, Manhattan, NY 10001'
      },
      orderDate: '2025-01-01',
      status: 'shipped',
      total: 3450.50,
      items: [
        {
          name: 'Botox 100u Vials',
          quantity: 5,
          price: 650.00,
          image: 'https://images.unsplash.com/photo-1585435557343-3b092031fc30?w=100&h=100&fit=crop'
        },
        {
          name: 'Vitamin C Brightening Serum',
          quantity: 12,
          price: 45.00,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop'
        }
      ],
      shipping: {
        method: 'Express',
        cost: 25.50,
        estimatedDelivery: '2025-01-03',
        trackingNumber: 'TRK123456789'
      },
      payment: {
        method: 'Credit Card',
        status: 'paid'
      }
    },
    {
      id: 'ORD-2024-156',
      customer: {
        name: 'Serenity Spa Center',
        email: 'orders@serenityspa.com',
        phone: '(555) 456-7890',
        address: '789 Wellness Blvd, Miami, FL 33101'
      },
      orderDate: '2024-12-28',
      status: 'delivered',
      total: 890.00,
      items: [
        {
          name: 'Hyaluronic Acid Moisturizer',
          quantity: 20,
          price: 32.00,
          image: 'https://images.unsplash.com/photo-1556229174-f75fb3c51ec6?w=100&h=100&fit=crop'
        },
        {
          name: 'Cleansing Oil',
          quantity: 15,
          price: 28.00,
          image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100&h=100&fit=crop'
        }
      ],
      shipping: {
        method: 'Standard',
        cost: 0,
        estimatedDelivery: '2025-01-02',
        trackingNumber: 'TRK987654321',
        deliveredDate: '2025-01-01'
      },
      payment: {
        method: 'Bank Transfer',
        status: 'paid'
      }
    },
    {
      id: 'ORD-2024-155',
      customer: {
        name: 'Urban Skin Clinic',
        email: 'admin@urbanskinclinic.com',
        phone: '(555) 321-0987',
        address: '321 Urban Ave, Portland, OR 97201'
      },
      orderDate: '2024-12-27',
      status: 'cancelled',
      total: 2100.00,
      items: [
        {
          name: 'Advanced Peel Solution',
          quantity: 6,
          price: 350.00,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop'
        }
      ],
      shipping: {
        method: 'Express',
        cost: 0,
        estimatedDelivery: '2024-12-30'
      },
      payment: {
        method: 'Credit Card',
        status: 'refunded'
      },
      cancellationReason: 'Customer requested cancellation'
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-[#30B7D2] bg-blue-100';
      case 'shipped': return 'text-[#958673] bg-orange-100';
      case 'delivered': return 'text-[#114538] bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return Clock;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Package;
    }
  };

  const totalOrders = orders.length;
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'processing').length;
  const avgOrderValue = totalRevenue / orders.filter(o => o.status !== 'cancelled').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light mb-2">Order Management</h1>
          <p className="text-muted-foreground font-light">
            Process orders, track shipments, and manage customer relationships
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="rounded-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Orders
          </Button>
          <Button variant="outline" className="rounded-full">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4" style={{color: '#30B7D2'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">{totalOrders}</div>
            <p className="text-sm text-muted-foreground">{pendingOrders} pending</p>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4" style={{color: '#114538'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">${totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Avg Order Value
              </CardTitle>
              <Package className="h-4 w-4" style={{color: '#958673'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">${avgOrderValue.toFixed(0)}</div>
            <p className="text-sm text-muted-foreground">Per order</p>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Fulfillment Rate
              </CardTitle>
              <Truck className="h-4 w-4" style={{color: '#2b251c'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">98.5%</div>
            <p className="text-sm text-muted-foreground">On-time delivery</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders..."
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
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      <Card className="border-subtle shadow-warm">
        <CardHeader>
          <CardTitle className="font-normal">Recent Orders</CardTitle>
          <CardDescription className="font-light">
            Manage and track all customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              
              return (
                <div key={order.id} className="p-4 rounded-lg border border-subtle hover:bg-accent/30 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#ded7c9'}}>
                          <StatusIcon className="h-5 w-5" style={{color: '#2b251c'}} />
                        </div>
                        <div>
                          <h3 className="font-medium">{order.id}</h3>
                          <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.orderDate} • {order.items.length} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <div className="text-lg font-medium mt-1">${order.total.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg">
                          <div className="w-12 h-12 bg-accent rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} × ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Customer & Shipping Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                          Customer Information
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{order.customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{order.customer.phone}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-xs">{order.customer.address}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                          Shipping & Payment
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Shipping:</span>
                            <span>{order.shipping.method}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Payment:</span>
                            <span>{order.payment.method}</span>
                          </div>
                          {order.shipping.trackingNumber && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Tracking:</span>
                              <span className="font-mono text-xs">{order.shipping.trackingNumber}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Delivery:</span>
                            <span>{order.shipping.deliveredDate || order.shipping.estimatedDelivery}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {order.cancellationReason && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-800">
                            Cancelled: {order.cancellationReason}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t border-subtle">
                      <div className="text-xs text-muted-foreground">
                        Payment Status: <span className={`font-medium ${
                          order.payment.status === 'paid' ? 'text-green-600' : 
                          order.payment.status === 'pending' ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {order.payment.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="rounded-full px-4">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-full px-4">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                        {order.shipping.trackingNumber && (
                          <Button size="sm" variant="outline" className="rounded-full px-4">
                            <Truck className="h-3 w-3 mr-1" />
                            Track
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}