import type { CodegenConfig } from '@graphql-codegen/cli';

// Use introspection from deployed backend or local development
const GRAPHQL_ENDPOINT = process.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4001/graphql';

const config: CodegenConfig = {
  overwrite: true,
  schema: GRAPHQL_ENDPOINT,
  documents: ['src/graphql/**/*.graphql'],
  ignoreNoDocuments: true, // Don't fail if no documents found
  generates: {
    'src/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        skipTypename: false,
        avoidOptionals: false,
        maybeValue: 'T | null',
        dedupeFragments: true, // Deduplicate fragments
        skipDocumentsValidation: true, // Skip validation for duplicate operation names
        scalars: {
          ID: 'string',
          DateTime: 'string',
          Date: 'string',
          JSON: 'any',
          Money: 'number',
        },
      },
    },
  },
};

export default config;
