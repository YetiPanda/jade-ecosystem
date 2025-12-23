// Runtime configuration file
// This file is replaced in production by Docker entrypoint
// For local development, it provides default values
window.ENV = window.ENV || {
  VITE_GRAPHQL_ENDPOINT: undefined // Will fall back to import.meta.env or localhost
};
