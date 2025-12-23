/**
 * Apollo Client Configuration
 *
 * Configures Apollo Client for GraphQL communication
 */

import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Support runtime environment variables (injected by Docker)
// @ts-ignore - window.ENV is injected at runtime via config.js
const runtimeEnv = typeof window !== 'undefined' && window.ENV;
const GRAPHQL_ENDPOINT =
  runtimeEnv?.VITE_GRAPHQL_ENDPOINT ||
  import.meta.env.VITE_GRAPHQL_ENDPOINT ||
  'http://localhost:4001/graphql';

/**
 * HTTP link for GraphQL requests
 */
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'include', // Include cookies for session management
});

/**
 * Auth link - adds authentication token to requests
 */
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage
  const token = localStorage.getItem('accessToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

/**
 * Error link - handles GraphQL and network errors
 */
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Clear stored tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Redirect to login (you might want to use your router for this)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

/**
 * Apollo Client cache configuration
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Configure pagination for products
        products: {
          keyArgs: ['filters'],
          merge(existing, incoming) {
            if (!existing) return incoming;

            return {
              ...incoming,
              edges: [...(existing.edges || []), ...(incoming.edges || [])],
            };
          },
        },
        // Configure pagination for appointments
        appointments: {
          keyArgs: ['filters'],
          merge(existing, incoming) {
            if (!existing) return incoming;

            return {
              ...incoming,
              edges: [...(existing.edges || []), ...(incoming.edges || [])],
            };
          },
        },
      },
    },
  },
});

/**
 * Create Apollo Client instance
 */
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: import.meta.env.DEV,
});

/**
 * Helper to set authentication token
 */
export function setAuthToken(accessToken: string, refreshToken?: string): void {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
}

/**
 * Helper to clear authentication
 */
export function clearAuth(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  apolloClient.clearStore();
}

/**
 * Helper to get current token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('accessToken');
}

export default apolloClient;
