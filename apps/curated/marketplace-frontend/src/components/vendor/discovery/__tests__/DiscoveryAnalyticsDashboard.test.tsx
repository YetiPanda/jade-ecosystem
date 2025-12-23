/**
 * DiscoveryAnalyticsDashboard Component Tests
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend (Task D.2.10)
 *
 * Integration-style tests for the main dashboard orchestrator component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { DiscoveryAnalyticsDashboard } from '../DiscoveryAnalyticsDashboard';
import { GET_DISCOVERY_ANALYTICS } from '../../../graphql/queries/vendor-portal';

// Mock data matching the GraphQL schema
const mockAnalyticsData = {
  impressions: {
    total: 10000,
    bySource: [
      { source: 'SEARCH', count: 4500, percentage: 45.0 },
      { source: 'VALUES', count: 2500, percentage: 25.0 },
      { source: 'CATEGORY', count: 1500, percentage: 15.0 },
      { source: 'RECOMMENDED', count: 1000, percentage: 10.0 },
      { source: 'DIRECT', count: 500, percentage: 5.0 },
    ],
    trend: 'UP',
    percentChange: 12.5,
  },
  queriesLeadingToYou: [
    {
      query: 'organic face serum',
      volume: 1250,
      yourPosition: 1,
      topCompetitor: 'GreenBeauty Co.',
    },
    {
      query: 'anti-aging cream',
      volume: 890,
      yourPosition: 3,
      topCompetitor: 'Youth Labs',
    },
  ],
  missedQueries: [
    {
      query: 'hydrating toner',
      volume: 420,
    },
  ],
  valuesPerformance: [
    {
      value: 'ORGANIC',
      impressions: 5000,
      clicks: 800,
      conversions: 120,
      rank: 1,
      ctr: 16.0,
      conversionRate: 15.0,
    },
    {
      value: 'CRUELTY_FREE',
      impressions: 3500,
      clicks: 420,
      conversions: 63,
      rank: 2,
      ctr: 12.0,
      conversionRate: 15.0,
    },
  ],
  profileEngagement: {
    profileViews: 5000,
    avgTimeOnProfile: 125,
    catalogBrowses: 3500,
    productClicks: 2000,
    contactClicks: 250,
    bounceRate: 22.5,
  },
  recommendations: [
    {
      type: 'PROFILE',
      priority: 'HIGH',
      title: 'Complete Your Profile',
      description: 'Your profile is only 60% complete.',
      actionLabel: 'Complete Profile',
      actionRoute: '/app/vendor/profile',
      potentialImpact: '+40% more profile views',
    },
  ],
};

// Wrapper component to provide all necessary contexts
const renderWithProviders = (mocks: any[] = []) => {
  return render(
    <BrowserRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <DiscoveryAnalyticsDashboard />
      </MockedProvider>
    </BrowserRouter>
  );
};

describe('DiscoveryAnalyticsDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('renders loading state initially', () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      renderWithProviders(mocks);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('displays loading skeletons for components', () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
          delay: 100,
        },
      ];

      const { container } = renderWithProviders(mocks);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Successful Data Load', () => {
    it('renders all main sections after data loads', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      renderWithProviders(mocks);

      await waitFor(() => {
        expect(screen.getByText('Traffic Sources')).toBeInTheDocument();
        expect(screen.getByText('Top Search Queries')).toBeInTheDocument();
        expect(screen.getByText('Values Performance')).toBeInTheDocument();
        expect(screen.getByText('Profile Engagement')).toBeInTheDocument();
      });
    });

    it('renders DateRangePicker component', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      renderWithProviders(mocks);

      await waitFor(() => {
        expect(screen.getByText('Date Range:')).toBeInTheDocument();
      });
    });

    it('renders ImpressionSourcesChart with data', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      renderWithProviders(mocks);

      await waitFor(() => {
        expect(screen.getByText('Traffic Sources')).toBeInTheDocument();
        expect(screen.getByText('10,000')).toBeInTheDocument();
        expect(screen.getByText('+12.5%')).toBeInTheDocument();
      });
    });

    it('renders SearchQueriesTable with data', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      renderWithProviders(mocks);

      await waitFor(() => {
        expect(screen.getByText('organic face serum')).toBeInTheDocument();
        expect(screen.getByText('anti-aging cream')).toBeInTheDocument();
      });
    });

    it('renders ValuesPerformanceGrid with data', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      renderWithProviders(mocks);

      await waitFor(() => {
        expect(screen.getByText('Values Performance')).toBeInTheDocument();
        expect(screen.getByText('Organic')).toBeInTheDocument();
        expect(screen.getByText('Cruelty-Free')).toBeInTheDocument();
      });
    });

    it('renders EngagementFunnel with data', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      renderWithProviders(mocks);

      await waitFor(() => {
        expect(screen.getByText('Profile Engagement')).toBeInTheDocument();
        expect(screen.getByText('5,000')).toBeInTheDocument();
        expect(screen.getByText('2m 5s')).toBeInTheDocument();
      });
    });

    it('renders RecommendationsFeed with data', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      renderWithProviders(mocks);

      await waitFor(() => {
        expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
        expect(screen.getByText('+40% more profile views')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when GraphQL query fails', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          error: new Error('Network error'),
        },
      ];

      renderWithProviders(mocks);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('displays user-friendly error message', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          error: new Error('Failed to fetch'),
        },
      ];

      renderWithProviders(mocks);

      await waitFor(() => {
        expect(screen.getByText(/unable to load/i)).toBeInTheDocument();
      });
    });
  });

  describe('Empty Data States', () => {
    it('handles empty impressions data', async () => {
      const emptyMocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: {
                ...mockAnalyticsData,
                impressions: {
                  total: 0,
                  bySource: [],
                  trend: 'FLAT',
                  percentChange: 0,
                },
              },
            },
          },
        },
      ];

      renderWithProviders(emptyMocks);

      await waitFor(() => {
        expect(screen.getByText('Traffic Sources')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });

    it('handles empty queries data', async () => {
      const emptyMocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: {
                ...mockAnalyticsData,
                queriesLeadingToYou: [],
              },
            },
          },
        },
      ];

      renderWithProviders(emptyMocks);

      await waitFor(() => {
        expect(screen.getByText('No Search Data Yet')).toBeInTheDocument();
      });
    });

    it('handles empty recommendations', async () => {
      const emptyMocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: {
                ...mockAnalyticsData,
                recommendations: [],
              },
            },
          },
        },
      ];

      renderWithProviders(emptyMocks);

      await waitFor(() => {
        expect(screen.getByText('All Set!')).toBeInTheDocument();
      });
    });
  });

  describe('Page Header', () => {
    it('renders page title', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      renderWithProviders(mocks);

      await waitFor(() => {
        expect(screen.getByText('Discovery Analytics')).toBeInTheDocument();
      });
    });

    it('renders page subtitle', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      renderWithProviders(mocks);

      await waitFor(() => {
        expect(screen.getByText(/Understand how spas discover your brand/)).toBeInTheDocument();
      });
    });
  });

  describe('Layout and Structure', () => {
    it('renders components in correct grid layout', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      const { container } = renderWithProviders(mocks);

      await waitFor(() => {
        const grids = container.querySelectorAll('.grid');
        expect(grids.length).toBeGreaterThan(0);
      });
    });

    it('applies proper spacing between sections', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      const { container } = renderWithProviders(mocks);

      await waitFor(() => {
        const spacedSections = container.querySelectorAll('.space-y-6, .space-y-8');
        expect(spacedSections.length).toBeGreaterThan(0);
      });
    });

    it('applies responsive grid classes', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      const { container } = renderWithProviders(mocks);

      await waitFor(() => {
        const responsiveGrids = container.querySelectorAll('.md\\:grid-cols-2, .lg\\:grid-cols-2');
        expect(responsiveGrids.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      renderWithProviders(mocks);

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { level: 1, name: /Discovery Analytics/i });
        expect(mainHeading).toBeInTheDocument();
      });
    });

    it('renders accessible page structure', async () => {
      const mocks = [
        {
          request: {
            query: GET_DISCOVERY_ANALYTICS,
            variables: {
              dateRange: {
                startDate: expect.any(String),
                endDate: expect.any(String),
              },
            },
          },
          result: {
            data: {
              discoveryAnalytics: mockAnalyticsData,
            },
          },
        },
      ];

      const { container } = renderWithProviders(mocks);

      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });
    });
  });
});
