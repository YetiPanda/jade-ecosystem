/**
 * Search Queries Table Component
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend - Task D.2.3
 *
 * Displays search queries that lead to vendor profiles with:
 * - Query text
 * - Search volume (how many times searched)
 * - Vendor's position in results
 * - Top competitor
 * - Sorting by volume or position
 */

import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Trophy, Medal, Award as AwardIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface SearchQuery {
  query: string;
  volume: number;
  yourPosition?: number | null;
  topCompetitor?: string | null;
}

interface SearchQueriesTableProps {
  queries: SearchQuery[];
}

type SortField = 'volume' | 'position';
type SortDirection = 'asc' | 'desc';

export function SearchQueriesTable({ queries }: SearchQueriesTableProps) {
  const [sortField, setSortField] = useState<SortField>('volume');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Handle undefined or empty data
  if (!queries || queries.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No search query data available</p>
        </div>
      </div>
    );
  }

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort queries
  const sortedQueries = [...queries].sort((a, b) => {
    let aValue, bValue;

    if (sortField === 'volume') {
      aValue = a.volume;
      bValue = b.volume;
    } else {
      aValue = a.yourPosition || 999;
      bValue = b.yourPosition || 999;
    }

    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Position badge component
  const PositionBadge = ({ position }: { position?: number | null }) => {
    if (!position) {
      return <span className="text-sm text-gray-500">Not Ranked</span>;
    }

    const color =
      position === 1
        ? 'bg-yellow-100 text-yellow-700'
        : position <= 3
        ? 'bg-blue-100 text-blue-700'
        : position <= 5
        ? 'bg-green-100 text-green-700'
        : 'bg-gray-100 text-gray-700';

    const Icon = position === 1 ? Trophy : position === 2 ? Medal : position === 3 ? AwardIcon : null;

    return (
      <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium', color)}>
        {Icon && <Icon className="h-4 w-4" />}
        #{position}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Top Search Queries</h3>
      </div>

      {/* Table */}
      {queries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Query
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('volume')}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  aria-label="Sort by Volume"
                >
                  Volume
                  {sortField === 'volume' ? (
                    sortDirection === 'desc' ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('position')}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  aria-label="Sort by Position"
                >
                  Your Position
                  {sortField === 'position' ? (
                    sortDirection === 'desc' ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Top Competitor
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedQueries.map((query, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{query.query}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">{query.volume.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">searches</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PositionBadge position={query.yourPosition} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {query.topCompetitor || <span className="text-gray-400">-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Empty state */}
      {queries.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="text-gray-400 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Search Data Yet</h3>
          <p className="text-sm text-gray-500">
            Complete your profile and add values to appear in more search results.
          </p>
        </div>
      )}

      {/* Footer with insights */}
      {queries.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> Ranking in the top 3 positions typically drives 60% of clicks. If you're ranking lower than position 5, consider adding relevant values or certifications to improve your visibility.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
