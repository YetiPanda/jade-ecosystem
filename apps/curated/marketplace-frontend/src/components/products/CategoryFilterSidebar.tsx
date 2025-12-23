/**
 * Category Filter Sidebar Component
 *
 * Features:
 * - Progressive Disclosure (Glance → Scan → Study)
 * - Hierarchical category navigation
 * - Multi-select filters (functions, concerns, formats)
 * - Professional level filters
 * - Usage time filters
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Filter, X } from 'lucide-react';
import { useTaxonomyFilterOptions, type ProductCategory } from '../../hooks/useTaxonomy';
import { useProgressiveDisclosure } from '../../hooks/useProgressiveDisclosure';

export interface CategoryFilters {
  categoryIds: string[];
  functionIds: string[];
  concernIds: string[];
  formatIds: string[];
  targetAreaIds: string[];
  regionIds: string[];
  usageTimes: string[];
  professionalLevels: string[];
}

interface CategoryFilterSidebarProps {
  filters: CategoryFilters;
  onFilterChange: (filters: CategoryFilters) => void;
  onClearAll: () => void;
}

export const CategoryFilterSidebar: React.FC<CategoryFilterSidebarProps> = ({
  filters,
  onFilterChange,
  onClearAll,
}) => {
  const { data, loading, error } = useTaxonomyFilterOptions();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    functions: false,
    concerns: false,
    formats: false,
    professionalLevel: false,
    usageTime: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleToggle = (
    filterKey: keyof CategoryFilters,
    value: string
  ) => {
    const currentValues = filters[filterKey] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...filters,
      [filterKey]: newValues,
    });
  };

  const getTotalActiveFilters = (): number => {
    return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
  };

  if (loading) {
    return (
      <aside className="w-80 border-r border-gray-200 bg-white p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-80 border-r border-gray-200 bg-white p-6">
        <div className="text-red-600 text-sm">
          Failed to load filters. Please try again.
        </div>
      </aside>
    );
  }

  const filterOptions = data?.taxonomyFilterOptions;
  if (!filterOptions) return null;

  const totalActive = getTotalActiveFilters();

  return (
    <aside className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 pb-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {totalActive > 0 && (
              <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                {totalActive}
              </span>
            )}
          </div>
          {totalActive > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-6 space-y-6">
        {/* Categories */}
        <FilterSection
          title="Categories"
          count={filters.categoryIds.length}
          isExpanded={expandedSections.categories}
          onToggle={() => toggleSection('categories')}
        >
          <CategoryTree
            categories={filterOptions.categories.filter((c) => c.level === 1)}
            selectedIds={filters.categoryIds}
            onToggle={(id) => handleToggle('categoryIds', id)}
          />
        </FilterSection>

        {/* Functions */}
        <FilterSection
          title="Functions"
          count={filters.functionIds.length}
          isExpanded={expandedSections.functions}
          onToggle={() => toggleSection('functions')}
        >
          <CheckboxList
            items={filterOptions.functions.map((f) => ({
              id: f.id,
              label: f.name,
              count: f.productCount,
            }))}
            selectedIds={filters.functionIds}
            onToggle={(id) => handleToggle('functionIds', id)}
          />
        </FilterSection>

        {/* Skin Concerns */}
        <FilterSection
          title="Skin Concerns"
          count={filters.concernIds.length}
          isExpanded={expandedSections.concerns}
          onToggle={() => toggleSection('concerns')}
        >
          <CheckboxList
            items={filterOptions.concerns.map((c) => ({
              id: c.id,
              label: c.name,
              count: c.productCount,
            }))}
            selectedIds={filters.concernIds}
            onToggle={(id) => handleToggle('concernIds', id)}
          />
        </FilterSection>

        {/* Product Formats */}
        <FilterSection
          title="Product Format"
          count={filters.formatIds.length}
          isExpanded={expandedSections.formats}
          onToggle={() => toggleSection('formats')}
        >
          <CheckboxList
            items={filterOptions.formats.map((f) => ({
              id: f.id,
              label: f.name,
              count: f.productCount,
            }))}
            selectedIds={filters.formatIds}
            onToggle={(id) => handleToggle('formatIds', id)}
          />
        </FilterSection>

        {/* Professional Level */}
        <FilterSection
          title="Professional Level"
          count={filters.professionalLevels.length}
          isExpanded={expandedSections.professionalLevel}
          onToggle={() => toggleSection('professionalLevel')}
        >
          <CheckboxList
            items={filterOptions.professionalLevels.map((level) => ({
              id: level,
              label: formatProfessionalLevel(level),
            }))}
            selectedIds={filters.professionalLevels}
            onToggle={(id) => handleToggle('professionalLevels', id)}
          />
        </FilterSection>

        {/* Usage Time */}
        <FilterSection
          title="Usage Time"
          count={filters.usageTimes.length}
          isExpanded={expandedSections.usageTime}
          onToggle={() => toggleSection('usageTime')}
        >
          <CheckboxList
            items={filterOptions.usageTimes.map((time) => ({
              id: time,
              label: formatUsageTime(time),
            }))}
            selectedIds={filters.usageTimes}
            onToggle={(id) => handleToggle('usageTimes', id)}
          />
        </FilterSection>
      </div>
    </aside>
  );
};

// ========================================
// Sub-components
// ========================================

interface FilterSectionProps {
  title: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  count,
  isExpanded,
  onToggle,
  children,
}) => {
  const { disclosureLevel, handleInteraction } = useProgressiveDisclosure();

  return (
    <div className="border-b border-gray-200 pb-6">
      <button
        onClick={() => {
          onToggle();
          handleInteraction('scan');
        }}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 group-hover:text-gray-700">
            {title}
          </span>
          {count > 0 && (
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded">
              {count}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {isExpanded && <div className="space-y-2">{children}</div>}
    </div>
  );
};

interface CheckboxListProps {
  items: Array<{ id: string; label: string; count?: number }>;
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const CheckboxList: React.FC<CheckboxListProps> = ({
  items,
  selectedIds,
  onToggle,
}) => {
  const { handleInteraction } = useProgressiveDisclosure();

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <label
          key={item.id}
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => handleInteraction('scan')}
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => onToggle(item.id)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
            {item.label}
          </span>
          {item.count !== undefined && (
            <span className="text-xs text-gray-500">({item.count})</span>
          )}
        </label>
      ))}
    </div>
  );
};

interface CategoryTreeProps {
  categories: ProductCategory[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  level?: number;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  selectedIds,
  onToggle,
  level = 0,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const { handleInteraction } = useProgressiveDisclosure();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
    handleInteraction('scan');
  };

  return (
    <div className={level > 0 ? 'ml-4 mt-2' : ''}>
      {categories.map((category) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedCategories[category.id];
        const isSelected = selectedIds.includes(category.id);

        return (
          <div key={category.id} className="mb-2">
            <div className="flex items-center gap-1">
              {hasChildren && (
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="p-0.5 hover:bg-gray-100 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-gray-500" />
                  )}
                </button>
              )}
              <label className="flex items-center gap-2 cursor-pointer group flex-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                    onToggle(category.id);
                    handleInteraction('scan');
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {category.name}
                </span>
                {category.productCount !== undefined && (
                  <span className="text-xs text-gray-500">
                    ({category.productCount})
                  </span>
                )}
              </label>
            </div>

            {hasChildren && isExpanded && (
              <CategoryTree
                categories={category.children!}
                selectedIds={selectedIds}
                onToggle={onToggle}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ========================================
// Helper Functions
// ========================================

function formatProfessionalLevel(level: string): string {
  const labels: Record<string, string> = {
    OTC: 'Over-the-Counter',
    PROFESSIONAL: 'Professional Use',
    MEDICAL_GRADE: 'Medical Grade',
    IN_OFFICE_ONLY: 'In-Office Only',
  };
  return labels[level] || level;
}

function formatUsageTime(time: string): string {
  const labels: Record<string, string> = {
    MORNING: 'Morning',
    EVENING: 'Evening',
    ANYTIME: 'Anytime',
    NIGHT_ONLY: 'Night Only',
    POST_TREATMENT: 'Post-Treatment',
  };
  return labels[time] || time;
}
