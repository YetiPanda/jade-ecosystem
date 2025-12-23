/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Runtime environment variables injected by Docker
interface RuntimeEnv {
  VITE_GRAPHQL_ENDPOINT?: string;
}

interface Window {
  ENV?: RuntimeEnv;
}
