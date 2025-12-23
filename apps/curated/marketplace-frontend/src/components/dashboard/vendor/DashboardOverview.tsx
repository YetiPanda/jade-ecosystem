import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/badge';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Star,
  Calendar,
  Plus,
  Target,
} from 'lucide-react';
import { useDashboardMetrics, useFormatCurrency, useFormatRelativeTime } from '../../../hooks/dashboard';
import { useDashboard } from '../../../contexts/DashboardContext';

export function DashboardOverview() {
  const { filters, setActiveView } = useDashboard();
  const { metrics, activities, loading } = useDashboardMetrics(filters.dateRange);
  const formatCurrency = useFormatCurrency();
  const formatRelativeTime = useFormatRelativeTime();

  const metricCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.revenue.total),
      change: `+${metrics.revenue.change}%`,
      period: 'vs last month',
      icon: DollarSign,
      color: '#2E8B57', // Jade green
      trend: metrics.revenue.trend,
    },
    {
      title: 'Active Products',
      value: metrics.products.active.toString(),
      change: `${metrics.products.total} total`,
      period: `${metrics.products.lowStock} low stock`,
      icon: Package,
      color: '#9CAF88', // Sage green
    },
    {
      title: 'Orders',
      value: metrics.orders.total.toString(),
      change: `+${metrics.orders.change}%`,
      period: 'vs last month',
      icon: ShoppingCart,
      color: '#8B9A6B', // Moss green
      trend: metrics.orders.trend,
    },
    {
      title: 'Customers',
      value: metrics.customers.total.toString(),
      change: `+${metrics.customers.change}%`,
      period: 'vs last month',
      icon: Users,
      color: '#B5A642', // Brass
      trend: metrics.customers.trend,
    }
  ];

  // Mock top products - will be replaced with real data from useProductsForDashboard
  const topProducts = [
    {
      name: 'HydraFacial Serum - Activ-4',
      sales: formatCurrency(18450),
      units: 89,
      growth: '+23%'
    },
    {
      name: 'Vitamin C Brightening Serum',
      sales: formatCurrency(12300),
      units: 156,
      growth: '+18%'
    },
    {
      name: 'Botox 100u Vials',
      sales: formatCurrency(45600),
      units: 12,
      growth: '+8%'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-5 w-5 text-jade" />;
      case 'product':
        return <Package className="h-5 w-5 text-terracotta" />;
      case 'customer':
        return <Users className="h-5 w-5 text-sage" />;
      case 'inventory':
        return <Package className="h-5 w-5 text-moss" />;
      default:
        return <Calendar className="h-5 w-5 text-jade" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-light mb-4">Loading dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-light mb-4">Welcome back to your Dashboard</h1>
        <p className="text-muted-foreground font-light max-w-2xl mx-auto">
          Manage your products, track sales, and grow your wholesale business with powerful tools and insights.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card key={index} className="border-border shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4" style={{color: metric.color}} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-light mb-1">{metric.value}</div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    color: metric.trend === 'up' ? '#2E8B57' : '#C65D4A',
                    backgroundColor: metric.trend === 'up' ? '#9CAF88' : '#E8B4B8'
                  }}
                >
                  {metric.change}
                </Badge>
                <span className="text-xs text-muted-foreground">{metric.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="font-normal">Recent Activity</CardTitle>
            <CardDescription className="font-light">
              Latest updates from your wholesale business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-accent/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent">
                    {getActivityIcon(activity.type)}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="font-normal">Top Performing Products</CardTitle>
            <CardDescription className="font-light">
              Your best sellers this period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div>
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.units} units sold</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{product.sales}</div>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{color: '#2E8B57', backgroundColor: '#9CAF88'}}
                    >
                      {product.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setActiveView('products')}
            >
              View All Products
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle className="font-normal">Quick Actions</CardTitle>
          <CardDescription className="font-light">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => setActiveView('products')}
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add Product</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => setActiveView('events')}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Create Event</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => setActiveView('inventory')}
            >
              <Package className="h-5 w-5" />
              <span className="text-xs">Check Inventory</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => setActiveView('analytics')}
            >
              <Target className="h-5 w-5" />
              <span className="text-xs">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
