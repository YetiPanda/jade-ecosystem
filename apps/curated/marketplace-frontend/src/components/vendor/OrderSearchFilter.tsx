/**
 * Order Search Filter Component
 * Sprint B.4: Order Management
 *
 * Reusable search and filter controls for vendor order lists
 */

import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { OrderStatus } from '../../graphql/generated';
import { DateRangePicker, DateRange } from './DateRangePicker';

interface OrderSearchFilterProps {
  searchTerm: string;
  filterStatus: OrderStatus | 'all';
  onSearchChange: (value: string) => void;
  onFilterChange: (status: OrderStatus | 'all') => void;
  placeholder?: string;

  // Optional date range filter
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;

  // Optional spa filter
  spaId?: string;
  onSpaChange?: (spaId: string) => void;
  spaOptions?: Array<{ id: string; name: string }>;
}

export function OrderSearchFilter({
  searchTerm,
  filterStatus,
  onSearchChange,
  onFilterChange,
  placeholder = 'Search by order number or spa name...',
  dateRange,
  onDateRangeChange,
  spaId,
  onSpaChange,
  spaOptions,
}: OrderSearchFilterProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* First Row: Search and Status */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-80 rounded-full border-subtle"
            />
          </div>

          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={onFilterChange}>
            <SelectTrigger className="w-40 rounded-full border-subtle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={OrderStatus.Pending}>Pending</SelectItem>
              <SelectItem value={OrderStatus.Confirmed}>Confirmed</SelectItem>
              <SelectItem value={OrderStatus.Processing}>Processing</SelectItem>
              <SelectItem value={OrderStatus.Shipped}>Shipped</SelectItem>
              <SelectItem value={OrderStatus.Delivered}>Delivered</SelectItem>
              <SelectItem value={OrderStatus.Cancelled}>Cancelled</SelectItem>
              <SelectItem value={OrderStatus.Returned}>Returned</SelectItem>
              <SelectItem value={OrderStatus.Disputed}>Disputed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Second Row: Date Range and Spa Filters (if provided) */}
      {(dateRange || spaOptions) && (
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Date Range Filter */}
          {dateRange && onDateRangeChange && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Date Range:</span>
              <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
            </div>
          )}

          {/* Spa Filter */}
          {spaOptions && spaOptions.length > 0 && onSpaChange && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Spa:</span>
              <Select value={spaId || 'all'} onValueChange={onSpaChange}>
                <SelectTrigger className="w-48 rounded-full border-subtle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Spas</SelectItem>
                  {spaOptions.map((spa) => (
                    <SelectItem key={spa.id} value={spa.id}>
                      {spa.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderSearchFilter;
